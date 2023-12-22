import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { PaymentsResolver } from './payments.resolver';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         validationSchema: Joi.object({
            STRIPE_SECRET_KEY: Joi.string().required(),
            // PORT: Joi.number().required(),
            NOTIFICATION_HOST: Joi.string().required(),
            NOTIFICATION_PORT: Joi.number().required(),
         }),
      }),
      GraphQLModule.forRoot<ApolloDriverConfig>({
         driver: ApolloFederationDriver,
         autoSchemaFile: {
            federation: 2,
         },
      }),
      ClientsModule.registerAsync([
         {
            name: NOTIFICATIONS_SERVICE,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.TCP,
               options: {
                  host: configService.get('NOTIFICATION_HOST'),
                  port: configService.get('NOTIFICATION_PORT'),
               },
            }),
            inject: [ConfigService],
         },
      ]),
      LoggerModule,
   ],
   controllers: [PaymentsController],
   providers: [PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
