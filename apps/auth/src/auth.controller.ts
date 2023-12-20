import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
   AuthServiceController,
   AuthServiceControllerMethods,
   CurrentUser,
   UsersDocument,
} from '@app/common';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
   constructor(private readonly authService: AuthService) {}

   @UseGuards(LocalAuthGuard)
   @Post('login')
   async login(
      @CurrentUser() currentUser: UsersDocument,
      @Res({ passthrough: true }) response: Response,
   ) {
      await this.authService.login(currentUser, response);
      response.send(currentUser);
   }

   @UseGuards(JwtAuthGuard)
   async authenticate(@Payload() data: any) {
      return {
         ...data.user,
         id: data.user._id,
      };
   }

   @Get()
   getHello(): string {
      return this.authService.getHello();
   }
}
