import { COLLECTIONS_CONSTANT } from "../../utilities/collections.constant"
import { PlayerCareersEntity } from "../entities/playerCareers.entity";
import mongoose, { Schema } from "mongoose";

const { BESOCCER_PLAYERS_CAREERS_COLLECTION_NAME, BESOCCER_PLAYERS_CAREERS_REPOSITORY_NAME } = COLLECTIONS_CONSTANT;

export const PlayerCareersSchema = new Schema<PlayerCareersEntity & Document>(
  {
    player_id: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    player_national_career: {
      type: Schema.Types.Mixed,
      required: false
    },
    player_summary_career: {
      type: Schema.Types.Mixed,
      required: false
    },
    player_team_career: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  {
    versionKey: false
  }
);

//--------------------------Connect multiple database----------------------

export const createPlayersCareersRepository = (connection: mongoose.Connection) => {
  return connection.model<PlayerCareersEntity & Document>(
    BESOCCER_PLAYERS_CAREERS_REPOSITORY_NAME,
    PlayerCareersSchema,
    BESOCCER_PLAYERS_CAREERS_COLLECTION_NAME
  );
};