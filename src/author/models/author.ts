import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Book } from 'src/book/models/book'

@ObjectType()
export class Author {
  @Field(() => ID)
  readonly id?: string
  @Field()
  readonly firstName?: string
  @Field()
  readonly lastName?: string
  @Field(() => [Book])
  readonly books?: Book[]
}
