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
import { Book } from 'src/book/models/book'
import { AuthorService } from './author.service'
import { AuthorInput } from './dto/inputs/author.input'
import { Author } from './models/author'

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private authorService: AuthorService) {}

  @Query(() => Author, { nullable: true })
  async getAuthor(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Author> {
    return this.authorService.findOne(id)
  }

  @Query(() => [Author])
  async getAuthors(
    @Args({ name: 'minNumberOfBooks', type: () => Int, nullable: true })
    minNumberOfBooks: number,
    @Args({ name: 'maxNumberOfBooks', type: () => Int, nullable: true })
    maxNumberOfBooks: number,
  ): Promise<Author[]> {
    return this.authorService.findByNumberOfBooks(
      minNumberOfBooks,
      maxNumberOfBooks,
    )
  }

  @Mutation(() => Author)
  async createAuthor(@Args('author') author: AuthorInput): Promise<Author> {
    return this.authorService.create(author)
  }

  @Mutation(() => Int)
  async deleteAuthor(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Number> {
    return this.authorService.remove(id)
  }

  @Mutation(() => Int)
  async deleteAuthorWithBooks(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Number> {
    return this.authorService.removeWithBooks(id)
  }

  @ResolveField()
  async books(@Parent() parent): Promise<Book[]> {
    return this.authorService.getBooks(parent.id)
  }
}
