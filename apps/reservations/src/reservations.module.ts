import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
   AUTH_PACKAGE_NAME,
   AUTH_SERVICE,
   AUTH_SERVICE_NAME,
   DatabaseModule,
   HealthModule,
   LoggerModule,
   PAYMENTS_PACKAGE_NAME,
   PAYMENTS_SERVICE_NAME,
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
import { join } from 'path';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         validationSchema: Joi.object({
            MONGODB_URI: Joi.string().required(),
            PORT: Joi.number().required(),
         }),
      }),
      DatabaseModule,
      DatabaseModule.forFeature([
         { name: ReservationDocument.name, schema: ReservationSchema },
      ]),
      LoggerModule,
      ClientsModule.registerAsync([
         {
            name: AUTH_SERVICE_NAME,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.GRPC,
               options: {
                  package: AUTH_PACKAGE_NAME,
                  protoPath: join(__dirname, '../../../proto/auth.proto'),
                  url: configService.getOrThrow('AUTH_GRPC_URL'),
               },
            }),
            inject: [ConfigService],
         },
         {
            name: PAYMENTS_SERVICE_NAME,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.GRPC,
               options: {
                  package: PAYMENTS_PACKAGE_NAME,
                  protoPath: join(__dirname, '../../../proto/payments.proto'),
                  url: configService.getOrThrow('PAYMENTS_GRPC_URL'),
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
