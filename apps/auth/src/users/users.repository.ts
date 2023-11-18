import { AbstractRepository } from "@app/common";
import { UsersDocument } from "./models/users.schema";
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