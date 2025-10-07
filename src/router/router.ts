
import express from 'express'

import PlayersService from '../players/services/players.service'
import PlayersController from '../players/controllers/players.controller'

import CoachesController from '../coaches/controllers/coaches.controller';
//--------------------------Connect 1 database-----------------------------
// import { PlayersInjuriesRepository } from '../players/repositories/playerInjuries.repository'
// import { MappingPlayersRepository } from '../players/repositories/mappingPlayers.repository'

//--------------------------Connect multiple database-----------------------------
import { createPlayersInjuriesRepository } from '../players/repositories/playerInjuries.repository';
import { createMappingPlayersRepository } from '../players/repositories/mappingPlayers.repository';
import { createPlayersCareersRepository } from '../players/repositories/playerCareers.repository';
import { conn1, conn2 } from '../players/connect';

import { createH2HCoachesRepository } from '../coaches/repository/h2hCoach.repository';
import { pgPool } from '../coaches/connect';
import CoachesService from '../coaches/services/coaches.service';


// Tạo các router riêng biệt
// const playerRouter = express.Router();
const coachRouter = express.Router();

//--------------------------Connect 1 database------------------------------------
// const playerService = new PlayersService(PlayersInjuriesRepository, MappingPlayersRepository)

//--------------------------Connect multiple database-----------------------------

// Tạo repository từ các kết nối
// export const PlayersInjuriesRepositoryDev = createPlayersInjuriesRepository(conn1); // Repository cho injuries for dev
// export const MappingPlayersRepositoryDev = createMappingPlayersRepository(conn1); // Repository cho mapping for dev
// export const PlayersInjuriesRepositoryStaging = createPlayersInjuriesRepository(conn2); // Repository cho injuries for staging
// export const MappingPlayersRepositoryStaging = createMappingPlayersRepository(conn2); // Repository cho mapping for staging

// export const PlayersCareersRepositoryDev = createPlayersCareersRepository(conn1)
// export const PlayersCareersRepositoryStaging = createPlayersCareersRepository(conn2)

// const playerService = new PlayersService(
//     PlayersInjuriesRepositoryDev, 
//     MappingPlayersRepositoryDev, 
//     PlayersInjuriesRepositoryStaging,
//     MappingPlayersRepositoryStaging,
//     PlayersCareersRepositoryDev,
//     PlayersCareersRepositoryStaging
// )
// const playerController = new PlayersController(playerService)

export const CoachesH2H = createH2HCoachesRepository(pgPool)

const coachService = new CoachesService(
    CoachesH2H, 
)

const coachController = new CoachesController(coachService)

// playerRouter.get("/football/player-type-besoccer", playerController.getInjuryTypes)
// playerRouter.post("/football/player-sync-besoccer-injury", playerController.syncInjuryPlayer)
// playerRouter.post("/football/player-sync-besoccer-career", playerController.syncCareerPlayer)

coachRouter.get("/football/coach-sync-h2h", coachController.syncDataH2HCoaches)

export { 
    // playerRouter,
    coachRouter };