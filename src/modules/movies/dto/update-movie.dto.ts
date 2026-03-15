import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  poster?: string;

  @IsInt()
  @Min(1900)
  @IsOptional()
  releaseYear?: number;
}
