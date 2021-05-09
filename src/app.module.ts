import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthorModule } from './author/author.module'
import { AuthorEntity } from './author/entities/author.entity'
import { BookModule } from './book/book.module'
import { BookEntity } from './book/entities/book.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [AuthorEntity, BookEntity],
      // todo: get from env configurations
      type: 'mysql',
      host: 'localhost',
      port: 6000,
      username: 'users_service',
      password: '123',
      database: 'CATALOG',
      synchronize: true, // todo: switch off
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      autoSchemaFile: `src/schema.gql`,
    }),
    AuthorModule,
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
