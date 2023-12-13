import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable, catchError, map, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constant";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
   constructor(@Inject(AUTH_SERVICE) private readonly clientProxy: ClientProxy){}

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const jwt = context.switchToHttp().getRequest().cookies?.Authenication ||
      context.switchToHttp().getRequest().headers?.authentication;

      if(!jwt) return false;
      
      return this.clientProxy.send<UserDto>('authenticate', {
         Authenication: jwt
      }).pipe(
         tap((res) => {
            context.switchToHttp().getRequest().user = res;
         }),
         map(() => true),
         catchError(() => {
            return of(false);
         }),
      )
   }
   
}