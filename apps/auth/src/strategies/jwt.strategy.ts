import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { TokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      configService: ConfigService,
      private usersService: UsersService
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromExtractors([
            (request: any) => request?.cookies?.Authenication ||
            request?.Authenication ||
            request?.headers.Authentication
         ]),
         secretOrKey: configService.get('JWT_SECRET')
      });
   }

   async validate({ userId }: TokenPayload) {
      return this.usersService.getUser({ _id: userId});
   }
}