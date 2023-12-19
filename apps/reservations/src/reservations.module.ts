import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
   AUTH_SERVICE,
   DatabaseModule,
   HealthModule,
   LoggerModule,
   PAYMENT_SERVICE,
} from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import {
   ReservationDocument,
   ReservationSchema,
} from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         validationSchema: Joi.object({
            MONGODB_URI: Joi.string().required(),
            PORT: Joi.number().required(),
            AUTH_HOST: Joi.string().required(),
            AUTH_PORT: Joi.number().required(),
            PAYMENT_HOST: Joi.string().required(),
            PAYMENT_PORT: Joi.number().required(),
         }),
      }),
      DatabaseModule,
      DatabaseModule.forFeature([
         { name: ReservationDocument.name, schema: ReservationSchema },
      ]),
      LoggerModule,
      ClientsModule.registerAsync([
         {
            name: AUTH_SERVICE,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.RMQ,
               options: {
                  urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
                  queue: 'auth',
               },
            }),
            inject: [ConfigService],
         },
         {
            name: PAYMENT_SERVICE,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.RMQ,
               options: {
                  urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
                  queue: 'payments',
               },
            }),
            inject: [ConfigService],
         },
      ]),
      HealthModule,
   ],
   controllers: [ReservationsController],
   providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
