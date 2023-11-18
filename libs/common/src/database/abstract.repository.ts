import { Logger, NotFoundException } from "@nestjs/common";
import { AbstractDocument } from "./abstract.schema";
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
   protected abstract readonly logger: Logger;
   constructor(protected readonly model: Model<TDocument>) {}

   async create(
      document: Omit<TDocument, '_id'>,
      options?: QueryOptions<TDocument>
   ): Promise<TDocument> {
      const createdDocument = new this.model({
         ...document,
         _id: new Types.ObjectId(),
         options
      })
      return (await createdDocument.save()).toJSON() as unknown as TDocument;
   }

   async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
      const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

      if(!document) {
         this.logger.warn('Document was not found with filterQuery', filterQuery);
         throw new NotFoundException('Document was not found');
      }

      return document;
   }

   async findOneAndUpdate(
      filterQuery: FilterQuery<TDocument>, 
      update: UpdateQuery<TDocument>,
      options?: QueryOptions<TDocument>,
   ): Promise<TDocument> {
      const document = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean<TDocument>(true);

      if(!document) {
         this.logger.warn('Document was not found with filterQuery', filterQuery);
         throw new NotFoundException('Document was not found');
      }

      return document;
   }

   async find(
      filterQuery: FilterQuery<TDocument>,
      options?: QueryOptions<TDocument>
   ): Promise<TDocument[]> {
      return this.model.find(filterQuery, options).lean<TDocument[]>(true);
   }

   async findOneAndDelete(
      filterQuery: FilterQuery<TDocument>,
      options?: QueryOptions<TDocument>
   ): Promise<TDocument> {
      return this.model.findOneAndDelete(filterQuery, options).lean<TDocument>(true);
   }
}