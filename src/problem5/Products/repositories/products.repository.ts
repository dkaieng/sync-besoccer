import {
  baseSchemaFields,
  baseSchemaOptions,
} from "../../../utilities/base.schema";
import { COLLECTIONS_CONSTANT } from "../../../utilities/collections.constant";
import { ProductEntity } from "../entities/products.entity";
import mongoose, { Schema } from "mongoose";

const { PRODUCT_COLLECTION_NAME, PRODUCT_REPOSITORY_NAME } = COLLECTIONS_CONSTANT;

export const ProductSchema = new Schema<ProductEntity & Document>(
  {
    sku: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    ...baseSchemaFields
  },
  {
    ...baseSchemaOptions
  }
);



export const ProductRepository = mongoose.connection.model<ProductEntity & Document>(
  PRODUCT_REPOSITORY_NAME,
  ProductSchema,
  PRODUCT_COLLECTION_NAME
);
