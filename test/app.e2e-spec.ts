import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('App', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should create author', async () => {
    const result = await request(app.getHttpServer())
      .post('/public/api/v1/graphql')
      .send({
        query: createAuthorQuery,
        variables: {
          author: {
            firstName: 'Marat',
            lastName: 'Kutlugundini',
          },
        },
      })
      .set('Accept', 'application/json')
    // .set('Authorization', `Bearer ${userToken}`)
    // .expect('Content-Type', /json/)
    // .expect(200)

    console.log(result)
    // .endAsync()
    // .then((res) => {
    //   console.log(res)
    // })
    // .get('/')
    // .expect(200)
    // .expect('Hello World!')
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
