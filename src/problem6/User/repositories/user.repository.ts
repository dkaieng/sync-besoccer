import {
  baseSchemaFields,
  baseSchemaOptions,
} from "../../../utilities/base.schema";
import { COLLECTIONS_CONSTANT } from "../../../utilities/collections.constant";
import { UserEntity } from "../entities/user.entity";
import mongoose, { Schema } from "mongoose";

const { USER_COLLECTION_NAME, USER_REPOSITORY_NAME } = COLLECTIONS_CONSTANT;

export const UserSchema = new Schema<UserEntity & Document>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    nickName: {
      type: String,
    },
    yearOld: {
      type: Number,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    ...baseSchemaFields,
  },
  {
    ...baseSchemaOptions,
  }
);

export const UserRepository = mongoose.connection.model<UserEntity & Document>(
  USER_REPOSITORY_NAME,
  UserSchema,
  USER_COLLECTION_NAME
);
