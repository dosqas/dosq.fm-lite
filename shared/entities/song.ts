import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Genre } from "./genre";

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  song_id!: number | string; // Allow both number and string for offline support

  @Column()
  albumCover!: string;

  @Column()
  title!: string;

  @Column()
  artist!: string;

  @Column()
  album!: string;

  @ManyToOne(() => Genre, (genre) => genre.songs, { onDelete: "CASCADE" })
  genre!: Genre;

  @Column()
  hour!: string;

  @Column()
  minute!: string;

  @Column()
  day!: string;

  @Column()
  month!: string;

  @Column()
  year!: string;
}