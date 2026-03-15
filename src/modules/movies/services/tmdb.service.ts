import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { MovieSource } from '../../../domain/entities';

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
}

export interface TmdbResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

@Injectable()
export class TmdbService {
  private readonly apiClient: AxiosInstance;
  private readonly imageBaseUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('TMDB_API_KEY');
    const baseUrl = this.configService.get('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
    this.imageBaseUrl = this.configService.get('TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p/w500');

    this.apiClient = axios.create({
      baseURL: baseUrl,
      params: {
        api_key: apiKey,
      },
    });
  }

  async getPopularMovies(page: number = 1): Promise<any[]> {
    try {
      const response = await this.apiClient.get<TmdbResponse>('/movie/popular', {
        params: { page },
      });
      return this.mapTmdbMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching popular movies from TMDB:', error);
      return [];
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<any[]> {
    try {
      const response = await this.apiClient.get<TmdbResponse>('/search/movie', {
        params: { query, page },
      });
      return this.mapTmdbMovies(response.data.results);
    } catch (error) {
      console.error('Error searching movies in TMDB:', error);
      return [];
    }
  }

  async getMovieById(id: string): Promise<any | null> {
    try {
      const response = await this.apiClient.get<TmdbMovie>(`/movie/${id}`);
      const movies = this.mapTmdbMovies([response.data]);
      return movies[0] || null;
    } catch (error) {
      console.error('Error fetching movie from TMDB:', error);
      return null;
    }
  }

  private mapTmdbMovies(tmdbMovies: TmdbMovie[]): any[] {
    return tmdbMovies.map((movie) => ({
      id: `tmdb-${movie.id}`,
      title: movie.title,
      description: movie.overview,
      poster: movie.poster_path ? `${this.imageBaseUrl}${movie.poster_path}` : null,
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      source: MovieSource.TMDB,
    }));
  }
}
