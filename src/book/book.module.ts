import { forwardRef, Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookResolver } from './book.resolver'
import { BookEntity } from './entities/book.entity'
import { BookService } from './book.service'
import { AuthorModule } from '../author/author.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    forwardRef(() => AuthorModule),
  ],
  providers: [BookResolver, BookService, Logger],
  exports: [BookService],
})
export class BookModule {}
