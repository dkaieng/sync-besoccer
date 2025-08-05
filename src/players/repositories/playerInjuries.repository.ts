import { COLLECTIONS_CONSTANT } from "../../utilities/collections.constant"
import { PlayerInjuriesEntity } from "../entities/playerInjuries.entity";
import mongoose, { Schema } from "mongoose";

const { BESOCCER_PLAYERS_INJURIES_COLLECTION_NAME, BESOCCER_PLAYERS_INJURIES_REPOSITORY_NAME } = COLLECTIONS_CONSTANT;

export const PlayerInjuriesSchema = new Schema<PlayerInjuriesEntity & Document>(
  {
    player_id: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    injuries: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  {
    versionKey: false
  }
);


//--------------------------Connect 1 database-----------------------------

// export const PlayersInjuriesRepository = mongoose.connection.model<PlayerInjuriesEntity & Document>(
//   BESOCCER_PLAYERS_INJURIES_REPOSITORY_NAME,
//   PlayerInjuriesSchema,
//   BESOCCER_PLAYERS_INJURIES_COLLECTION_NAME
// );

//--------------------------Connect multiple database----------------------

export const createPlayersInjuriesRepository = (connection: mongoose.Connection) => {
  return connection.model<PlayerInjuriesEntity & Document>(
    BESOCCER_PLAYERS_INJURIES_REPOSITORY_NAME,
    PlayerInjuriesSchema,
    BESOCCER_PLAYERS_INJURIES_COLLECTION_NAME
  );
};