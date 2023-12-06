import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser, UsersDocument } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('users')
export class UsersController {
   constructor(private usersService: UsersService) {}

   @Post()
   async createUser(@Body() creatUserDto: CreateUserDto) {
      return this.usersService.create(creatUserDto);
   } 

   @UseGuards(JwtAuthGuard)
   @Get()
   async getUser(
      @CurrentUser() user: UsersDocument
   ) {
      return user;
   }
}
