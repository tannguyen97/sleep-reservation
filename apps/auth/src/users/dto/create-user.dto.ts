import {
   IsArray,
   IsEmail,
   IsNotEmpty,
   IsOptional,
   IsString,
} from 'class-validator';
import { RoleDto } from './role.dto';

export class CreateUserDto {
   @IsEmail()
   email: string;

   @IsString()
   password: string;

   @IsOptional()
   @IsArray()
   roles?: RoleDto[];
}
