import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersDocument } from '@app/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => UsersDocument)
export class UsersResolver {
   constructor(private readonly usersService: UsersService) {}

   @Mutation(() => UsersDocument)
   createUser(
      @Args('createUserInput')
      createUserInput: CreateUserDto,
   ) {
      return this.usersService.create(createUserInput);
   }

   @Query(() => [UsersDocument], { name: 'users' })
   findAll() {
      return this.usersService.findAll();
   }
}
