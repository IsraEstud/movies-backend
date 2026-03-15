import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum MovieSource {
  TMDB = 'tmdb',
  INTERNAL = 'internal',
}

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  poster: string;

  @Column({ name: 'release_year', type: 'int', nullable: true })
  releaseYear: number;

  @Column({ length: 20 })
  source: MovieSource;

  @ManyToOne(() => User, (user) => user.movies, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
