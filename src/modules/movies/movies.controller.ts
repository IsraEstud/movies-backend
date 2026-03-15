import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../domain/entities';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMovies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.moviesService.getAllMovies(page, limit);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchMovies(@Query('q') query: string, @Query('page') page: number = 1) {
    return this.moviesService.searchMovies(query, page);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createMovie(@Body() createMovieDto: CreateMovieDto, @Request() req) {
    return this.moviesService.createMovie(createMovieDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateMovie(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @Request() req,
  ) {
    return this.moviesService.updateMovie(id, updateMovieDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteMovie(@Param('id') id: string, @Request() req) {
    return this.moviesService.deleteMovie(id, req.user.userId, req.user.role);
  }
}
