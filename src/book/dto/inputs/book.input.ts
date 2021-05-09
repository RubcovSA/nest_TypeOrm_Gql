import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class BookInput {
  @Field()
  title: string
  @Field(() => [ID])
  authorIds: string[]
}
