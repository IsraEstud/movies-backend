import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { TmdbService } from './services/tmdb.service';
import { Movie } from '../../domain/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [MoviesService, TmdbService],
  exports: [MoviesService],
})
export class MoviesModule {}
