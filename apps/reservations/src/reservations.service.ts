import {
   PAYMENTS_SERVICE_NAME,
   PaymentsServiceClient,
   UserDto,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService implements OnModuleInit {
   private paymentsService: PaymentsServiceClient;
   constructor(
      private reservationsRepository: ReservationsRepository,
      @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc,
   ) {}

   onModuleInit() {
      this.paymentsService = this.client.getService<PaymentsServiceClient>(
         PAYMENTS_SERVICE_NAME,
      );
   }
   async create(
      createReservationDto: CreateReservationDto,
      { _id: userId, email }: UserDto,
   ) {
      return this.paymentsService
         .createCharge({ ...createReservationDto.charge, email })
         .pipe(
            map((res) => {
               return this.reservationsRepository.create({
                  ...createReservationDto,
                  invoiceId: res.id,
                  timestamp: new Date(),
                  userId,
               });
            }),
         );
   }

   findAll() {
      return this.reservationsRepository.find({});
   }

   findOne(_id: string) {
      return this.reservationsRepository.findOne({ _id });
   }

   update(_id: string, updateReservationDto: UpdateReservationDto) {
      return this.reservationsRepository.findOneAndUpdate(
         { _id },
         { $set: updateReservationDto },
      );
   }

   remove(_id: string) {
      return this.reservationsRepository.findOneAndDelete({ _id });
   }
}
