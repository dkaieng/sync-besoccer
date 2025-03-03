import {
  baseSchemaFields,
  baseSchemaOptions,
} from "../../../utilities/base.schema";
import { COLLECTIONS_CONSTANT } from "../../../utilities/collections.constant";
import { ConfigEntity } from "../entities/config.entity";
import mongoose, { Schema } from "mongoose";

const { CONFIG_COLLECTION_NAME, CONFIG_REPOSITORY_NAME } = COLLECTIONS_CONSTANT;

export const ConfigSchema = new Schema<ConfigEntity & Document>(
  {
    isAddScoreEnabled: {
      type: Boolean,
      default: true,
    },
    ...baseSchemaFields,
  },
  {
    ...baseSchemaOptions,
  }
);

export const ConfigRepository = mongoose.connection.model<
  ConfigEntity & Document
>(CONFIG_REPOSITORY_NAME, ConfigSchema, CONFIG_COLLECTION_NAME);
