import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getUserFavorites(@Request() req) {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }

  @Post()
  async addFavorite(@Body('movieId') movieId: string, @Request() req) {
    return this.favoritesService.addFavorite(req.user.userId, movieId);
  }

  @Delete(':id')
  async removeFavorite(@Param('id') id: string, @Request() req) {
    return this.favoritesService.removeFavorite(req.user.userId, id);
  }
}
