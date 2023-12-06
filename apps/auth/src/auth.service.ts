import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersDocument } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async login(user: UsersDocument, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString()
    }

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

    const token = await this.jwtService.sign(tokenPayload);

    response.cookie('Authenication', token, {
      httpOnly: true,
      expires
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
