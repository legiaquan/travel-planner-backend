import { Document, Model, Schema } from 'mongoose';

interface IBaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  toObject(): Record<string, unknown>;
}

interface IBaseModel<T extends Document> extends Model<T> {
  findActive(): Promise<T[]>;
  findInactive(): Promise<T[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<T[]>;
}

export const baseSchemaPlugin = (schema: Schema) => {
  // Add timestamps
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // Update timestamps on save
  schema.pre('save', function (this: IBaseDocument, next) {
    this.updatedAt = new Date();
    next();
  });

  // Update timestamps on update
  schema.pre(['updateOne', 'findOneAndUpdate'], function (this: IBaseDocument, next) {
    this.set({ updatedAt: new Date() });
    next();
  });

  // Add common methods
  schema.method('toJSON', function (this: IBaseDocument): Record<string, unknown> {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
  });

  // Add static methods
  schema.static('findActive', function (this: IBaseModel<IBaseDocument>): Promise<IBaseDocument[]> {
    return this.find({ status: 'active' });
  });

  schema.static('findInactive', function (this: IBaseModel<IBaseDocument>): Promise<
    IBaseDocument[]
  > {
    return this.find({ status: 'inactive' });
  });

  schema.static(
    'findByDateRange',
    function (
      this: IBaseModel<IBaseDocument>,
      startDate: Date,
      endDate: Date,
    ): Promise<IBaseDocument[]> {
      return this.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    },
  );
};
