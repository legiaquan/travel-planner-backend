import { IBaseDocument } from '@/interfaces/base-document.interface';
import { Schema } from 'mongoose';

export const auditPlugin = (schema: Schema) => {
  schema.pre('save', function (this: IBaseDocument, next) {
    if (this.isNew) {
      this.set('createdBy', this.get('updatedBy'));
    }
    next();
  });

  schema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    this.set({ updatedBy: this.getOptions().user?._id });
    next();
  });
};
