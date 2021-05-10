import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Author } from '../../author/models/author'

@ObjectType()
export class Book {
  @Field(() => ID)
  readonly id?: string
  @Field()
  readonly title?: string
  @Field(() => [Author])
  readonly authors?: Author[]
}
