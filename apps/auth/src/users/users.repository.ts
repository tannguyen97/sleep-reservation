import { AbstractRepository, UsersDocument } from "@app/common";
import { Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class UsersRepository extends AbstractRepository<UsersDocument> {
   protected readonly logger = new Logger(UsersRepository.name);
   constructor(
      @InjectModel(UsersDocument.name) private readonly usersModel: Model<UsersDocument>
   ) {
      super(usersModel)
   }
}