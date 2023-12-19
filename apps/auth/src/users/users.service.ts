import {
   Injectable,
   UnauthorizedException,
   UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
   constructor(private usersRepository: UsersRepository) {}
   async create(createUserDto: CreateUserDto) {
      await this.validateCreateUserDto(createUserDto);
      const user = new User({
         ...createUserDto,
         password: await bcrypt.hash(createUserDto.password, 10),
         roles: createUserDto.roles.map((roleDto) => new Role(roleDto)),
      });
      return this.usersRepository.create(user);
   }

   async validateCreateUserDto(createUserDto: CreateUserDto) {
      try {
         await this.usersRepository.findOne({ email: createUserDto.email });
      } catch (error) {
         return;
      }
      throw new UnprocessableEntityException('Email already exists.');
   }

   async verifyUser(email: string, password: string) {
      const user = await this.usersRepository.findOne({ email });

      console.log(user);

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
         throw new UnauthorizedException('Credentials are not valid');
      }

      return user;
   }

   async getUser(getUserDto: GetUserDto) {
      return this.usersRepository.findOne(getUserDto, { roles: true });
   }
}
