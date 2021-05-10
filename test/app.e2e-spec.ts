import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { AuthorEntity } from '../src/author/entities/author.entity'
import { BookEntity } from '../src/book/entities/book.entity'
import { BookInput } from '../src/book/dto/inputs/book.input'
import { Repository } from 'typeorm'
import { AuthorInput } from '../src/author/dto/inputs/author.input'

let app: INestApplication

describe('App', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    const repository: Repository<BookEntity> = moduleFixture.get(
      'BookEntityRepository',
    )
    await repository.query('delete from author_books_book;')
    await repository.query('delete from author;')
    await repository.query('delete from book;')
  })

  afterAll(async () => {
    await app.close()
  })
  const author1: AuthorEntity = {
    firstName: 'Marat',
    lastName: 'Kutlugundini',
  }
  it('should create author', async () => {
    const result = await createAuthorQuery(author1)

    author1.id = result.body.data.createAuthor.id
    author1.books = []
    expect(result.body.data.createAuthor).toEqual(author1)
  })

  const author2: AuthorEntity = {
    firstName: 'Montana',
    lastName: 'Savirovich',
  }
  it('should create second author', async () => {
    const result = await createAuthorQuery(author2)

    author2.id = result.body.data.createAuthor.id
    author2.books = []
    expect(result.body.data.createAuthor).toEqual(author2)
  })

  let book1: BookEntity
  it('should create book', async () => {
    delete author1.books
    const book: BookInput = {
      title: 'Bar Table Notes',
      authorIds: [author1.id],
    }
    const result = await createBookQuery(book)

    book1 = result.body.data.createBook
    expect(book1.title).toEqual(book.title)
    expect(book1.authors[0]).toEqual(author1)
  })

  let book2: BookEntity
  it('should create book and not duplicate authors', async () => {
    delete author2.books
    const book: BookInput = {
      title: 'Notes from the Bar',
      authorIds: [author1.id, author1.id],
    }
    const result = await createBookQuery(book)

    book2 = result.body.data.createBook
    expect(book2.title).toEqual(book.title)
    expect(book2.authors.length).toEqual(1)
    expect(book2.authors[0]).toEqual(author1)
  })
  it('should create book and delete it', async () => {
    const book: BookInput = {
      title: 'Notes from the Bar',
      authorIds: [author1.id, author2.id],
    }
    const result = await createBookQuery(book)

    const bookCreated = result.body.data.createBook
    expect(bookCreated.title).toEqual(book.title)
    expect(bookCreated.authors.length).toEqual(2)

    const deleteBookResponse = await deleteBookQuery(bookCreated.id)
    expect(deleteBookResponse.body.data.deleteBook).toEqual(1)
    const deleteBookResponse2 = await deleteBookQuery(bookCreated.id)
    expect(deleteBookResponse2.body.data.deleteBook).toEqual(0)
    const getBookResponse = await getBookQuery(bookCreated.id)
    expect(getBookResponse.body.data.getBook).toEqual(null)
  })
  it('should create author and delete it', async () => {
    const author: AuthorInput = {
      firstName: 'Tenet',
      lastName: 'Tenetovich',
    }
    const result = await createAuthorQuery(author)

    const authorCreated = result.body.data.createAuthor
    expect(authorCreated.firstName).toEqual(author.firstName)
    expect(authorCreated.books.length).toEqual(0)

    const deleteAuthorResponse = await deleteAuthorQuery(authorCreated.id)
    expect(deleteAuthorResponse.body.data.deleteAuthor).toEqual(1)
    const deleteAuthorResponse2 = await deleteAuthorQuery(authorCreated.id)
    expect(deleteAuthorResponse2.body.data.deleteAuthor).toEqual(0)
    const getAuthorResponse = await getAuthorQuery(authorCreated.id)
    expect(getAuthorResponse.body.data.getAuthor).toEqual(null)
  })
  it('should add author to the book', async () => {
    const result = await addAuthorQuery(book2.id, author2.id)

    book2 = result.body.data.addAuthor
    expect(book2.authors.length).toEqual(2)

    expect(book2.authors.find((author) => author.id === author1.id)).toEqual(
      author1,
    )
    expect(book2.authors.find((author) => author.id === author2.id)).toEqual(
      author2,
    )
  })
  it('should not add author to the book if this author already in the list', async () => {
    const result = await addAuthorQuery(book2.id, author2.id)

    book2 = result.body.data.addAuthor
    expect(book2.authors.length).toEqual(2)

    expect(book2.authors.find((author) => author.id === author1.id)).toEqual(
      author1,
    )
    expect(book2.authors.find((author) => author.id === author2.id)).toEqual(
      author2,
    )
  })
  it('should get the book', async () => {
    const result = await getBookQuery(book1.id)
    const book = result.body.data.getBook
    expect(book).toEqual(book1)
  })
  it('should get the author', async () => {
    const result = await getAuthorQuery(author2.id)
    const author = result.body.data.getAuthor
    expect(author.id).toEqual(author2.id)
    expect(author.firstName).toEqual(author2.firstName)
    expect(author.lastName).toEqual(author2.lastName)
    Object.assign(author2, author)
  })
  it('should get the other author', async () => {
    const result = await getAuthorQuery(author1.id)
    const author = result.body.data.getAuthor
    expect(author.id).toEqual(author1.id)
    expect(author.firstName).toEqual(author1.firstName)
    expect(author.lastName).toEqual(author1.lastName)
    Object.assign(author1, author)
  })
  describe('should get authors', () => {
    it('without maxNumberOfBooks', async () => {
      const result = await getAuthorsQuery(null, 2)
      const authors = result.body.data.getAuthors

      expect(authors).toHaveLength(1)
      expect(authors[0]).toEqual(author1)
    })
    it('without minNumberOfBooks', async () => {
      const result = await getAuthorsQuery(1, null)
      const authors = result.body.data.getAuthors

      expect(authors).toHaveLength(1)
      expect(authors[0]).toEqual(author2)
    })
    it('without both parameters', async () => {
      const result = await getAuthorsQuery(null, null)
      const authors = result.body.data.getAuthors

      expect(authors).toHaveLength(2)
      expect(authors.find((author) => author.id === author1.id)).toEqual(
        author1,
      )
      expect(authors.find((author) => author.id === author2.id)).toEqual(
        author2,
      )
    })
    it('with both parameters', async () => {
      const result = await getAuthorsQuery(2, 0)
      const authors = result.body.data.getAuthors

      expect(authors).toHaveLength(2)
      expect(authors.find((author) => author.id === author1.id)).toEqual(
        author1,
      )
      expect(authors.find((author) => author.id === author2.id)).toEqual(
        author2,
      )
    })
    it('with both parameters with result []', async () => {
      const result = await getAuthorsQuery(0, 0)
      const authors = result.body.data.getAuthors

      expect(authors).toHaveLength(0)
    })
  })
  describe('should get books', () => {
    it('with partial title in beginning', async () => {
      const result = await getBooksQuery('Bar %')
      const books = result.body.data.getBooks

      expect(books).toHaveLength(1)
      expect(books[0]).toEqual(book1)
    })
    it('with partial title at the end', async () => {
      const result = await getBooksQuery('%notes')
      const books = result.body.data.getBooks

      expect(books).toHaveLength(1)
      expect(books[0]).toEqual(book1)
    })
    it('with partial title in the middle', async () => {
      const result = await getBooksQuery('%notes%')
      const books = result.body.data.getBooks

      expect(books).toHaveLength(2)
      expect(books.find((book) => book.id === book1.id)).toEqual(book1)
      expect(books.find((book) => book.id === book2.id)).toEqual(book2)
    })
    it('without title parameter', async () => {
      const result = await getBooksQuery(null)
      const books = result.body.data.getBooks

      expect(books).toHaveLength(2)
      expect(books.find((book) => book.id === book1.id)).toEqual(book1)
      expect(books.find((book) => book.id === book2.id)).toEqual(book2)
    })
    it('with not existed title return []', async () => {
      const result = await getBooksQuery('The second volume of Dead Souls')
      const books = result.body.data.getBooks

      expect(books).toHaveLength(0)
    })
  })
  it('should delete author with books', async () => {
    const result = await deleteAuthorWithBooksQuery(author1.id)

    expect(result.body.data.deleteAuthorWithBooks).toEqual(1 + 2)
    const res = await getBooksQuery(null)
    const books = res.body.data.getBooks

    expect(books).toHaveLength(1)
    expect(books[0].id).toEqual(book2.id)
    expect(books[0].authors.length).toEqual(1)
    delete author2.books
    expect(books[0].authors[0]).toEqual(author2)

    const response = await deleteAuthorWithBooksQuery(author1.id)
    expect(response.body.data.deleteAuthorWithBooks).toEqual(0)
  })
  it('should delete another author with books', async () => {
    const result = await deleteAuthorWithBooksQuery(author2.id)

    expect(result.body.data.deleteAuthorWithBooks).toEqual(1 + 1)
    const res = await getBooksQuery(null)
    const books = res.body.data.getBooks

    expect(books).toHaveLength(0)
    const response = await deleteAuthorWithBooksQuery(author2.id)
    expect(response.body.data.deleteAuthorWithBooks).toEqual(0)
  })
})

const deleteAuthorWithBooksQuery = async (id) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
        mutation deleteAuthorWithBooks($id: ID!) {
          deleteAuthorWithBooks(id: $id)
        }
      `,
      variables: {
        id,
      },
    })
    .set('Accept', 'application/json')
}
const createBookQuery = async (book: BookEntity) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      mutation query($book: BookInput!){
        createBook(book: $book) {
          id
          title
          authors {
            id
            firstName
            lastName
          }
        }
      }`,
      variables: {
        book,
      },
    })
    .set('Accept', 'application/json')
}
const createAuthorQuery = async (author: AuthorEntity) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      mutation createAuthor($author: AuthorInput!){
        createAuthor(author: $author) {
          id
          firstName
          lastName
          books {
            id
            title 
          }
        }
      }`,
      variables: {
        author,
      },
    })
    .set('Accept', 'application/json')
}
const addAuthorQuery = async (bookId, authorId) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      mutation query($bookId: ID!, $authorId: ID!){
        addAuthor(bookId: $bookId, authorId: $authorId) {
          id
          title
          authors {
            id
            firstName
            lastName
          }
        }
      }`,
      variables: {
        bookId,
        authorId,
      },
    })
    .set('Accept', 'application/json')
}
const getBookQuery = (bookId) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      query getBook($id: ID!){
        getBook(id: $id) {
          id
          title
          authors {
            id
            firstName
            lastName
          }
        }
      }`,
      variables: {
        id: bookId,
      },
    })
    .set('Accept', 'application/json')
}
const getAuthorQuery = (authorId) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      query getAuthor($id: ID!){
        getAuthor(id: $id) {
          id
          firstName
          lastName
          books {
            id
            title
          }
        }
      }`,
      variables: {
        id: authorId,
      },
    })
    .set('Accept', 'application/json')
}
const getAuthorsQuery = (maxNumberOfBooks, minNumberOfBooks) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      query getAuthors($minNumberOfBooks: Int, $maxNumberOfBooks: Int){
        getAuthors(minNumberOfBooks: $minNumberOfBooks, maxNumberOfBooks: $maxNumberOfBooks) {
          id
          firstName
          lastName
          books {
            id
            title
          }
        }
      }`,
      variables: {
        maxNumberOfBooks,
        minNumberOfBooks,
      },
    })
    .set('Accept', 'application/json')
}
const getBooksQuery = async (title) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      query getBooks($title: String){
        getBooks(title: $title) {
          id
          title
          authors {
            id
            firstName
            lastName
          }
        }
      }`,
      variables: {
        title,
      },
    })
    .set('Accept', 'application/json')
}
const deleteBookQuery = async (id) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      mutation deleteBook($id: ID!){
        deleteBook(id: $id)
      }`,
      variables: {
        id,
      },
    })
    .set('Accept', 'application/json')
}
const deleteAuthorQuery = async (id) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .send({
      query: `
      mutation deleteAuthor($id: ID!){
        deleteAuthor(id: $id)
      }`,
      variables: {
        id,
      },
    })
    .set('Accept', 'application/json')
}
