import {
  baseSchemaFields,
  baseSchemaOptions,
} from "../../../utilities/base.schema";
import { COLLECTIONS_CONSTANT } from "../../../utilities/collections.constant";
import { UserScoreEntity } from "../entities/userScore.entity";
import mongoose, { Schema } from "mongoose";

const {
  USER_SCORE_COLLECTION_NAME,
  USER_SCORE_REPOSITORY_NAME,
  USER_REPOSITORY_NAME,
} = COLLECTIONS_CONSTANT;

export const UserScoreSchema = new Schema<UserScoreEntity & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_REPOSITORY_NAME,
      required: true,
      index: true
    },
    score: {
      type: Number,
    },
    ...baseSchemaFields,
  },
  {
    ...baseSchemaOptions,
  }
);

export const UserScoreRepository = mongoose.connection.model<
  UserScoreEntity & Document
>(USER_SCORE_REPOSITORY_NAME, UserScoreSchema, USER_SCORE_COLLECTION_NAME);
