import {
   IsArray,
   IsEmail,
   IsNotEmpty,
   IsOptional,
   IsString,
} from 'class-validator';

export class CreateUserDto {
   @IsEmail()
   email: string;

   @IsString()
   password: string;

   @IsOptional()
   @IsArray()
   @IsString({ each: true })
   @IsNotEmpty({ each: true })
   roles?: string[];
}
