import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AuthorEntity } from '../../author/entities/author.entity'

@Entity('book')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id?: string

  @Column()
  title?: string

  @ManyToMany(() => AuthorEntity, (author) => author.books, { nullable: true })
  authors?: AuthorEntity[]
}
