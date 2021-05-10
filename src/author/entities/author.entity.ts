import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BookEntity } from '../../book/entities/book.entity'

@Entity('author')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id?: string

  @Column()
  firstName?: string

  @Column()
  lastName?: string

  @ManyToMany(() => BookEntity, (books) => books.authors, { nullable: true })
  @JoinTable()
  books?: BookEntity[]
}
