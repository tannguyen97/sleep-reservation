import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ versionKey: false })
@ObjectType()
export class UsersDocument extends AbstractDocument {
   @Prop()
   @Field()
   email: string;

   @Prop()
   @Field()
   password: string;

   @Prop()
   @Field(() => [String])
   roles?: string[];
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);
