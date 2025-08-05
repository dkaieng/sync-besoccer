import { COLLECTIONS_CONSTANT } from "../../utilities/collections.constant"
import { MappingPlayersEntity } from "../entities/mappingPlayers.entity";
import mongoose, { Schema } from "mongoose";

const { BESOCCER_MAPPING_PLAYERS_COLLECTION_NAME, BESOCCER_MAPPING_PLAYERS_REPOSITORY_NAME } = COLLECTIONS_CONSTANT;

export const MappingPlayersSchema = new Schema<MappingPlayersEntity & Document>(
  {
    player_id: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    thesport_id: {
      type: String,
      unique: true,
      required: true,
      index: true
    }
  },
  {
    versionKey: false
  }
);


//--------------------------Connect 1 database-----------------------------

// export const MappingPlayersRepository = mongoose.connection.model<MappingPlayersEntity & Document>(
//   BESOCCER_MAPPING_PLAYERS_REPOSITORY_NAME,
//   MappingPlayersSchema,
//   BESOCCER_MAPPING_PLAYERS_COLLECTION_NAME
// );

//--------------------------Connect multiple database----------------------

export const createMappingPlayersRepository = (connection: mongoose.Connection) => {
  return connection.model<MappingPlayersEntity & Document>(
    BESOCCER_MAPPING_PLAYERS_REPOSITORY_NAME,
    MappingPlayersSchema,
    BESOCCER_MAPPING_PLAYERS_COLLECTION_NAME
  );
};