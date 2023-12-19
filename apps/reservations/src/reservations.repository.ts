import { AbstractRepository } from '@app/common';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Reservation } from './models/reservation.entity';

export class ReservationsRepository extends AbstractRepository<Reservation> {
   protected readonly logger = new Logger(ReservationsRepository.name);
   constructor(
      @InjectRepository(Reservation)
      reservationRepository: Repository<Reservation>,
      entityManager: EntityManager,
   ) {
      super(reservationRepository, entityManager);
   }
}
