import { CurrentUser, User } from '@app/common';
import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @UseGuards(LocalAuthGuard)
   @Post('login')
   async login(
      @CurrentUser() currentUser: User,
      @Res({ passthrough: true }) response: Response,
   ) {
      await this.authService.login(currentUser, response);
      response.send(currentUser);
   }

   @UseGuards(JwtAuthGuard)
   @MessagePattern('authenticate')
   async authenticate(@Payload() data: any) {
      return data.user;
   }
}
