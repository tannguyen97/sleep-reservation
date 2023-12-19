import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { DatabaseModule, Role, User } from '@app/common';

@Module({
   imports: [DatabaseModule, DatabaseModule.forFeature([User, Role])],
   controllers: [UsersController],
   providers: [UsersService, UsersRepository],
   exports: [UsersService],
})
export class UsersModule {}
