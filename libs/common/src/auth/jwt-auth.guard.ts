import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
   Logger,
   OnModuleInit,
   UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constant';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { UserDto } from '../dto';
import { Reflector } from '@nestjs/core';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
   private readonly logger = new Logger(JwtAuthGuard.name);
   private authService: AuthServiceClient;

   constructor(
      @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
      private readonly reflector: Reflector,
   ) {}

   onModuleInit() {
      this.authService =
         this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
   }

   canActivate(
      context: ExecutionContext,
   ): boolean | Promise<boolean> | Observable<boolean> {
      const jwt =
         context.switchToHttp().getRequest().cookies?.Authentication ||
         context.switchToHttp().getRequest().headers?.authentication;

      console.log(jwt);

      if (!jwt) return false;

      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      return this.authService
         .authenticate({
            Authentication: jwt,
         })
         .pipe(
            tap((res) => {
               if (roles) {
                  for (const role of roles) {
                     if (!res.roles?.includes(role)) {
                        this.logger.error(
                           'The user does not have valid roles.',
                        );
                        throw new UnauthorizedException();
                     }
                  }
               }
               context.switchToHttp().getRequest().user = {
                  ...res,
                  _id: res.id,
               };
            }),
            map(() => true),
            catchError((err) => {
               this.logger.error(err);
               return of(false);
            }),
         );
   }
}
