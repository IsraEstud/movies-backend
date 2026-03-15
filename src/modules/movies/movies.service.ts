import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie, MovieSource, User, UserRole } from '../../domain/entities';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { TmdbService } from './services/tmdb.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private tmdbService: TmdbService,
  ) {}

  async getAllMovies(page: number = 1, limit: number = 20) {
    const internalMovies = await this.moviesRepository.find({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    const tmdbMovies = await this.tmdbService.getPopularMovies(page);

    const combinedMovies = [...internalMovies, ...tmdbMovies].map((movie) => ({
      ...movie,
      source: movie.source || MovieSource.TMDB,
    }));

    return {
      data: combinedMovies,
      message: 'Películas obtenidas exitosamente',
      statusCode: 200,
    };
  }

  async searchMovies(query: string, page: number = 1) {
    const internalMovies = await this.moviesRepository
      .createQueryBuilder('movie')
      .where('movie.title ILIKE :query', { query: `%${query}%` })
      .getMany();

    const tmdbMovies = await this.tmdbService.searchMovies(query, page);

    const combinedMovies = [...internalMovies, ...tmdbMovies].map((movie) => ({
      ...movie,
      source: movie.source || MovieSource.TMDB,
    }));

    return {
      data: combinedMovies,
      message: 'Búsqueda completada',
      statusCode: 200,
    };
  }

  async getMovieById(id: string) {
    if (id.startsWith('tmdb-')) {
      const tmdbId = id.replace('tmdb-', '');
      const movie = await this.tmdbService.getMovieById(tmdbId);
      if (!movie) {
        throw new NotFoundException('Película no encontrada');
      }
      return {
        data: movie,
        message: 'Película obtenida exitosamente',
        statusCode: 200,
      };
    }

    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Película no encontrada');
    }

    return {
      data: movie,
      message: 'Película obtenida exitosamente',
      statusCode: 200,
    };
  }

  async createMovie(createMovieDto: CreateMovieDto, userId: string) {
    const movie = this.moviesRepository.create({
      ...createMovieDto,
      source: MovieSource.INTERNAL,
      createdBy: { id: userId } as User,
    });

    await this.moviesRepository.save(movie);

    return {
      data: movie,
      message: 'Película creada exitosamente',
      statusCode: 201,
    };
  }

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto, userId: string, userRole: string) {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Película no encontrada');
    }

    if (movie.source === MovieSource.TMDB) {
      throw new ForbiddenException('No se puede editar películas de TMDB');
    }

    if (userRole !== UserRole.ADMIN && movie.createdBy?.id !== userId) {
      throw new ForbiddenException('No tienes permiso para editar esta película');
    }

    Object.assign(movie, updateMovieDto);
    await this.moviesRepository.save(movie);

    return {
      data: movie,
      message: 'Película actualizada exitosamente',
      statusCode: 200,
    };
  }

  async deleteMovie(id: string, userId: string, userRole: string) {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Película no encontrada');
    }

    if (movie.source === MovieSource.TMDB) {
      throw new ForbiddenException('No se puede eliminar películas de TMDB');
    }

    if (userRole !== UserRole.ADMIN && movie.createdBy?.id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta película');
    }

    await this.moviesRepository.remove(movie);

    return {
      data: null,
      message: 'Película eliminada exitosamente',
      statusCode: 200,
    };
  }
}
