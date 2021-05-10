import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { AuthorEntity } from '../src/author/entities/author.entity'

describe('App', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create author', async () => {
    const author: AuthorEntity = {
      firstName: 'Marat',
      lastName: 'Kutlugundini',
    }
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createAuthorQuery,
        variables: {
          author,
        },
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    author.id = result.body.data.createAuthor.id
    expect(result.body.data.createAuthor).toEqual(author)
  })

  it('should create author', async () => {
    const author: AuthorEntity = {
      firstName: 'Marat',
      lastName: 'Kutlugundini',
    }
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createAuthorQuery,
        variables: {
          author,
        },
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    author.id = result.body.data.createAuthor.id
    expect(result.body.data.createAuthor).toEqual(author)
  })
})

const createAuthorQuery = `
  mutation createAuthor($author: AuthorInput!){
    createAuthor(author: $author) {
      id
      firstName
      lastName
    }
  }`
