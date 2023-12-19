import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         validationSchema: Joi.object({
            STRIPE_SECRET_KEY: Joi.string().required(),
            PORT: Joi.number().required(),
            NOTIFICATION_HOST: Joi.string().required(),
            NOTIFICATION_PORT: Joi.number().required(),
         }),
      }),
      ClientsModule.registerAsync([
         {
            name: NOTIFICATIONS_SERVICE,
            useFactory: (configService: ConfigService) => ({
               transport: Transport.RMQ,
               options: {
                  urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
                  queue: 'notifications',
               },
            }),
            inject: [ConfigService],
         },
      ]),
      LoggerModule,
   ],
   controllers: [PaymentsController],
   providers: [PaymentsService],
})
export class PaymentsModule {}
