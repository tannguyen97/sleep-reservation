import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class RoleDto {
   @IsOptional()
   @IsNumber()
   id?: number;

   @IsOptional()
   @IsString()
   @IsNotEmpty()
   name?: string;
}
