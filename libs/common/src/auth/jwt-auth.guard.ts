import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Observable, map, tap } from "rxjs";
import { AUTH_SERVICE } from "..";
import { ClientProxy } from "@nestjs/microservices";

export class JwtAuthGuard implements CanActivate {
   constructor(@Inject(AUTH_SERVICE) private readonly clientProxy: ClientProxy){

   }

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const jwt = context?.switchToHttp()?.getRequest().cookies?.Authenication;

      if(!jwt) return false;

      this.clientProxy.send('authenicate', {
         Authenication: jwt
      }).pipe(
         tap(res => {
            context.switchToHttp().getRequest().user = res;
         }),
         map(() => true)
      )
   }
   
}