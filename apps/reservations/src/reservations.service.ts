import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENT_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
   constructor(
      private reservationsRepository: ReservationsRepository,
      @Inject(PAYMENT_SERVICE)
      private readonly paymentService: ClientProxy,
   ) {}
   async create(
      createReservationDto: CreateReservationDto,
      { id, email }: User,
   ) {
      return await this.paymentService
         .send('create_charge', { ...createReservationDto.charge, email })
         .pipe(
            map((res) => {
               const reservation = new Reservation({
                  ...createReservationDto,
                  invoiceId: res.id,
                  timestamp: new Date(),
                  userId: id,
               });
               return this.reservationsRepository.create(reservation);
            }),
         );
   }

   findAll() {
      return this.reservationsRepository.find({});
   }

   findOne(id: number) {
      return this.reservationsRepository.findOne({ id });
   }

   update(id: number, updateReservationDto: UpdateReservationDto) {
      return this.reservationsRepository.findOneAndUpdate(
         { id },
         updateReservationDto,
      );
   }

   remove(id: number) {
      return this.reservationsRepository.findOneAndDelete({ id });
   }
}
