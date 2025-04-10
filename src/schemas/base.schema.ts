import { Document, Schema } from 'mongoose';
import { auditPlugin } from '../plugins/audit.plugin';
import { baseSchemaPlugin } from '../plugins/base-schema.plugin';
import { paginationPlugin } from '../plugins/pagination.plugin';
import { versionPlugin } from '../plugins/version.plugin';

export const createBaseSchema = <T extends Document>(definition: Record<string, any>) => {
  const schema = new Schema<T>(definition, {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  });

  // Apply common plugins
  schema.plugin(baseSchemaPlugin);
  schema.plugin(versionPlugin);
  schema.plugin(auditPlugin);
  schema.plugin(paginationPlugin);

  return schema;
};
