import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite, Movie } from '../../domain/entities';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async getUserFavorites(userId: string) {
    const favorites = await this.favoritesRepository.find({
      where: { userId },
      relations: ['movie'],
      order: { createdAt: 'DESC' },
    });

    const movies = favorites
      .filter((fav) => fav.movie)
      .map((fav) => ({
        ...fav.movie,
        favoriteId: fav.id,
      }));

    return {
      data: movies,
      message: 'Favoritos obtenidos exitosamente',
      statusCode: 200,
    };
  }

  async addFavorite(userId: string, movieId: string) {
    const movie = await this.moviesRepository.findOne({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException('Película no encontrada');
    }

    const existingFavorite = await this.favoritesRepository.findOne({
      where: { userId, movieId },
    });

    if (existingFavorite) {
      throw new ConflictException('La película ya está en favoritos');
    }

    const favorite = this.favoritesRepository.create({
      userId,
      movieId,
    });

    await this.favoritesRepository.save(favorite);

    return {
      data: { ...movie, favoriteId: favorite.id },
      message: 'Película agregada a favoritos',
      statusCode: 201,
    };
  }

  async removeFavorite(userId: string, favoriteId: string) {
    const favorite = await this.favoritesRepository.findOne({
      where: { id: favoriteId, userId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoritesRepository.remove(favorite);

    return {
      data: null,
      message: 'Favorito eliminado exitosamente',
      statusCode: 200,
    };
  }
}
