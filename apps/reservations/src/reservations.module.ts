import {
   AUTH_SERVICE,
   DatabaseModule,
   HealthModule,
   LoggerModule,
   PAYMENT_SERVICE,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { Reservation } from './models/reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         validationSchema: Joi.object({
            PORT: Joi.number().required(),
            AUTH_HOST: Joi.string().required(),
            AUTH_PORT: Joi.number().required(),
            PAYMENT_HOST: Joi.string().required(),
            PAYMENT_PORT: Joi.number().required(),
         }),
      }),
      DatabaseModule,
      DatabaseModule.forFeature([Reservation]),
      LoggerModule,
      ClientsModule.registerAsync([
         {
            name: AUTH_SERVICE,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.TCP,
               options: {
                  host: configService.get('AUTH_HOST'),
                  port: configService.get('AUTH_PORT'),
               },
            }),
            inject: [ConfigService],
         },
         {
            name: PAYMENT_SERVICE,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.TCP,
               options: {
                  host: configService.get('PAYMENT_HOST'),
                  port: configService.get('PAYMENT_PORT'),
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
