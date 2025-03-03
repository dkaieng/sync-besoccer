import {
  baseSchemaFields,
  baseSchemaOptions,
} from "../../../utilities/base.schema";
import { COLLECTIONS_CONSTANT } from "../../../utilities/collections.constant";
import { Product } from "../entities/products.entity";
import mongoose, { Schema } from "mongoose";

const { PRODUCT_COLLECTION_NAME } = COLLECTIONS_CONSTANT;

export const ProductSchema = new Schema<Product & Document>(
  {
    sku: {
      type: String,
      unique: true,
      required: true
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



export const ProductRepository = mongoose.connection.model<Product & Document>(
  PRODUCT_COLLECTION_NAME,
  ProductSchema
);
