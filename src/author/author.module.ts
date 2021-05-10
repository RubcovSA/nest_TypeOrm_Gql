import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthorResolver } from './author.resolver'
import { AuthorEntity } from './entities/author.entity'
import { AuthorService } from './author.service'
import { BookModule } from '../book/book.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
    forwardRef(() => BookModule),
  ],
  providers: [AuthorResolver, AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
