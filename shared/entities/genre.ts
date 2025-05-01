import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Song } from "./song";

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  genre_id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Song, (song) => song.genre)
  songs!: Song[];
}