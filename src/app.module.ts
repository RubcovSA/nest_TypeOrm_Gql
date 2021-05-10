import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthorModule } from './author/author.module'
import { AuthorEntity } from './author/entities/author.entity'
import { BookModule } from './book/book.module'
import { BookEntity } from './book/entities/book.entity'
import { configurations } from './environment'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [AuthorEntity, BookEntity],
      ...configurations.db,
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
