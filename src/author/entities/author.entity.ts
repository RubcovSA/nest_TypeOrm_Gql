import { BookEntity } from 'src/book/entities/book.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

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
