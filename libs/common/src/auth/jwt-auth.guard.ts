import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable, catchError, map, tap } from "rxjs";
import { AUTH_SERVICE } from "../constant";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class JwtAuthGuard implements CanActivate {
   constructor(@Inject(AUTH_SERVICE) private readonly clientProxy: ClientProxy){}

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const jwt = context.switchToHttp().getRequest().cookies?.Authenication;

      if(!jwt) return false;
      
      return this.clientProxy.send('authenticate', {
         Authenication: jwt
      }).pipe(
         tap((res) => {
            context.switchToHttp().getRequest().user = res;
         }),
         map(() => true)
      )
   }
   
}