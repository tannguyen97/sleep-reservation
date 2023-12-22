import { Type } from 'class-transformer';
import {
   IsDate,
   IsDefined,
   IsNotEmpty,
   IsNotEmptyObject,
   IsString,
   ValidateNested,
} from 'class-validator';
import { CreateChargeDto } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationDto {
   @IsDate()
   @Type(() => Date)
   @Field()
   startDate: Date;

   @IsDate()
   @Type(() => Date)
   @Field()
   endDate: Date;

   @IsString()
   @IsNotEmpty()
   @Field()
   invoiceId: string;

   @IsString()
   @IsNotEmpty()
   @Field()
   placeId: string;

   @IsDefined()
   @IsNotEmptyObject()
   @ValidateNested()
   @Type(() => CreateChargeDto)
   @Field(() => CreateChargeDto)
   charge: CreateChargeDto;
}
