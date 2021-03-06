import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BookEntity } from '../book/entities/book.entity'
import { Repository } from 'typeorm'
import { AuthorEntity } from './entities/author.entity'

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
  ) {}

  async findOne(id: string): Promise<AuthorEntity> {
    return this.authorRepository.findOne(id)
  }

  async findAll(ids: string[]): Promise<AuthorEntity[]> {
    return this.authorRepository.findByIds(ids)
  }

  async create(author: AuthorEntity): Promise<AuthorEntity> {
    return this.authorRepository.save(author)
  }

  async remove(id: string): Promise<number> {
    const result = await this.authorRepository.delete(id)
    return result?.affected || 0
  }

  async removeWithBooks(id: string): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    })
    await this.authorRepository.delete(id)
    return author
  }

  async getBooks(id: string): Promise<BookEntity[]> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    })
    return author?.books
  }

  async findByNumberOfBooks(
    minNumberOfBooks?: number,
    maxNumberOfBooks?: number,
  ) {
    const query = this.authorRepository
      .createQueryBuilder('author')
      .select('author.id')
      .addSelect('count(books.id)', 'amountOfBooks')
      .leftJoin('author.books', 'books')
      .groupBy('author.id')

    if (minNumberOfBooks || minNumberOfBooks === 0) {
      query.andHaving('amountOfBooks >= :minNumberOfBooks', {
        minNumberOfBooks,
      })
    }

    if (maxNumberOfBooks || maxNumberOfBooks === 0) {
      query.andHaving('amountOfBooks <= :maxNumberOfBooks', {
        maxNumberOfBooks,
      })
    }
    const authors = await query.getMany()

    return this.findAll(authors.map(({ id }) => id))
  }
  // select a.id, count(b.id)
  // from author a
  // left join author_books_book abb on a.id = abb.authorId
  // left join book b on abb.bookId = b.id
  // group by a.id
  // having count(b.id) < 10
  //    and count(b.id) > 1;
}
