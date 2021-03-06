import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { AuthorService } from '../author/author.service'
import { AuthorEntity } from '../author/entities/author.entity'
import { Author } from '../author/models/author'
import { BookService } from './book.service'
import { BookInput } from './dto/inputs/book.input'
import { Book } from './models/book'
import { NotFoundException } from '@nestjs/common'

@Resolver(() => Book)
export class BookResolver {
  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
  ) {}

  @Query(() => Book, { nullable: true })
  async getBook(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Book> {
    return this.bookService.findOne(id)
  }

  @Query(() => [Book])
  async getBooks(
    @Args({ name: 'title', nullable: true }) title?: string,
  ): Promise<Book[]> {
    if (!title) {
      return this.bookService.getAllBooks()
    }
    return this.bookService.findByTitle(title)
  }

  @Mutation(() => Book)
  async createBook(@Args('book') book: BookInput): Promise<Book> {
    let authors: AuthorEntity[]
    if (book.authorIds && book.authorIds.length) {
      authors = await this.authorService.findAll(book.authorIds)
    }

    return this.bookService.create({
      ...book,
      authors,
    })
  }

  @Mutation(() => Int)
  async deleteBook(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<number> {
    return this.bookService.remove(id)
  }

  @Mutation(() => Book)
  async addAuthor(
    @Args({ name: 'authorId', type: () => ID }) authorId: string,
    @Args({ name: 'bookId', type: () => ID }) bookId: string,
  ): Promise<Book> {
    const author = await this.authorService.findOne(authorId)
    if (!author) {
      throw new NotFoundException()
    }

    const book = await this.bookService.addAuthor(author, bookId)
    if (!book) {
      throw new NotFoundException()
    }

    return book
  }

  @ResolveField()
  async authors(@Parent() parent): Promise<Author[]> {
    return this.bookService.getAuthors(parent.id)
  }
}
