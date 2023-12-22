import { Module } from '@nestjs/common';
import { AUTH_SERVICE, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { authContext } from './auth.context';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
   imports: [
      GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
         driver: ApolloGatewayDriver,
         useFactory: (configService: ConfigService) => ({
            server: {
               context: authContext,
            },
            gateway: {
               supergraphSdl: new IntrospectAndCompose({
                  subgraphs: [
                     {
                        name: 'reservations',
                        url: configService.getOrThrow(
                           'RESERVATIONS_GRAPHQL_URL',
                        ),
                     },
                     {
                        name: 'auth',
                        url: configService.getOrThrow('AUTH_GRAPHQL_URL'),
                     },
                     {
                        name: 'payments',
                        url: configService.getOrThrow('PAYMENTS_GRAPHQL_URL'),
                     },
                  ],
               }),
               buildService({ url }) {
                  return new RemoteGraphQLDataSource({
                     url,
                     willSendRequest({ request, context }) {
                        request.http.headers.set(
                           'user',
                           context.user ? JSON.stringify(context.user) : null,
                        );
                     },
                  });
               },
            },
         }),
         inject: [ConfigService],
      }),
      ClientsModule.registerAsync([
         {
            name: AUTH_SERVICE,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.TCP,
               options: {
                  host: configService.getOrThrow('AUTH_HOST'),
                  port: configService.getOrThrow('AUTH_PORT'),
               },
            }),
            inject: [ConfigService],
         },
      ]),
      ConfigModule.forRoot({
         isGlobal: true,
         validationSchema: Joi.object({
            PORT: Joi.number().required(),
         }),
      }),
      LoggerModule,
   ],
})
export class GatewayModule {}
