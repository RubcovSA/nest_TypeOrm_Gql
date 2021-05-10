import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthorEntity } from '../author/entities/author.entity'
import { Repository } from 'typeorm'
import { BookEntity } from './entities/book.entity'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
  ) {}

  async findOne(id: string): Promise<BookEntity> {
    return this.bookRepository.findOne(id)
  }

  async findAll(ids?: string[]): Promise<BookEntity[]> {
    return this.bookRepository.findByIds(ids)
  }

  async getAllBooks(): Promise<BookEntity[]> {
    return this.bookRepository.find()
  }

  async findByTitle(title: string): Promise<BookEntity[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('LOWER(book.title) like LOWER(:title)', { title })
      .getMany()
  }

  async create(book: BookEntity): Promise<BookEntity> {
    return this.bookRepository.save(book)
  }

  async remove(id: string): Promise<number> {
    const result = await this.bookRepository.delete(id)
    return result?.affected || 0
  }

  async removeBooksWithoutAuthors(ids: string[]) {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.authors', 'authors')
      .where('book.id in (:...ids)', { ids })
      .andWhere('author.id is null')
      .getMany()

    const result = await this.bookRepository.delete([
      ...books.map((book) => book.id),
    ])
    return result?.affected || 0
  }

  async getAuthors(id: string): Promise<AuthorEntity[]> {
    const book = await this.bookRepository.findOne(id, {
      relations: ['authors'],
    })
    return book?.authors
  }

  async addAuthor(author: AuthorEntity, bookId: string): Promise<BookEntity> {
    const book = await this.bookRepository.findOne(bookId, {
      relations: ['authors'],
    })
    if (!book) return

    if (book.authors.find((existedAuthor) => existedAuthor.id === author.id)) {
      return book
    }

    book.authors.push(author)
    return this.bookRepository.save(book)
  }
}
