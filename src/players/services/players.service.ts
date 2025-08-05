import axios from 'axios';
import { MappingPlayersRepositoryDev, MappingPlayersRepositoryStaging, PlayersInjuriesRepositoryDev, PlayersInjuriesRepositoryStaging } from '../../router/router';

//--------------------------Connect 1 database------------------------------------
// import { PlayersInjuriesRepository } from '../repositories/playerInjuries.repository';
// import { MappingPlayersRepository } from '../repositories/mappingPlayers.repository';

//--------------------------Connect multiple database-----------------------------


export interface IPlayersService {
    getInjuryTypes(start: number, end: number): Promise<any>
    syncInjuryPlayer(playerBeId: string, playerTSId: string): Promise<any>
}

export default class PlayersService implements IPlayersService {
//--------------------------Connect 1 database------------------------------------
  // repoPlayerInjury: typeof PlayersInjuriesRepository;
  // repoPlayerMapping: typeof MappingPlayersRepository;

  // constructor(
  //   repoPlayerInjury: typeof PlayersInjuriesRepository, 
  //   repoPlayerMapping: typeof MappingPlayersRepository,
  // ) {
  //   this.repoPlayerInjury = repoPlayerInjury
  //   this.repoPlayerMapping = repoPlayerMapping
  // }

//--------------------------Connect multiple database-----------------------------

  repoPlayerInjuryDev: typeof PlayersInjuriesRepositoryDev;
  repoPlayerMappingDev: typeof MappingPlayersRepositoryDev;
  repoPlayerInjuryStaging: typeof PlayersInjuriesRepositoryStaging;
  repoPlayerMappingStaging: typeof MappingPlayersRepositoryStaging;

  constructor(
    repoPlayerInjuryDev: typeof PlayersInjuriesRepositoryDev, 
    repoPlayerMappingDev: typeof MappingPlayersRepositoryDev,
    repoPlayerInjuryStaging: typeof PlayersInjuriesRepositoryStaging, 
    repoPlayerMappingStaging: typeof MappingPlayersRepositoryStaging,
  ) {
    this.repoPlayerInjuryDev = repoPlayerInjuryDev
    this.repoPlayerMappingDev = repoPlayerMappingDev
    this.repoPlayerInjuryStaging = repoPlayerInjuryStaging
    this.repoPlayerMappingStaging = repoPlayerMappingStaging
  }

  async getInjuryTypes(start: number, end: number): Promise<any> {
    const uniqueInjuries: any = {};

    for (let id = start; id <= end; id++) {
        try {
          const response = await axios.get(`https://fast.besoccer.com/scripts/api/api.php?req=player_injuries_st&format=json&v=657&appCountry=&lang=en&site=resultadosiPhone&key=825300886e6465fc5721a9ddbad0939a&device=iphone&id=${id}&vr=1`);
          const injuriesHistory = response.data.injuries_history;

          if (injuriesHistory && injuriesHistory.length > 0) {
            injuriesHistory.forEach((yearData:any) => {
              yearData.injuries_suspensions.forEach((injury:any) => {
                const uniqueKey = `${injury.injured_key}_${injury.injured_type}`;
                if (!uniqueInjuries[uniqueKey]) {
                  uniqueInjuries[uniqueKey] = injury.injured_name;
                }
              });
            });
          }
        } catch (error: any) {
            console.error(`Error fetching data for ID ${id}:`, error.message);
        }
    }

    return Array.from(uniqueInjuries);
  }

  async syncInjuryPlayer(playerBeId: string, playerTSId: string): Promise<any> {

    const response = await axios.get(`https://fast.besoccer.com/scripts/api/api.php?req=player_injuries_st&format=json&v=657&appCountry=&lang=en&site=resultadosiPhone&key=825300886e6465fc5721a9ddbad0939a&device=iphone&id=${playerBeId}&vr=1`);

    if (response?.data?.injuries_history?.length) {

      const result = await Promise.allSettled([
        this.repoPlayerInjuryDev.findOneAndUpdate({ player_id: playerBeId },{ player_id: playerBeId, injuries: response?.data?.injuries_history }, { new: true, upsert: true }),
        this.repoPlayerMappingDev.findOneAndUpdate({ player_id: playerBeId }, { player_id: playerBeId, thesport_id: playerTSId }, { new: true, upsert: true }),
        this.repoPlayerInjuryStaging.findOneAndUpdate({ player_id: playerBeId },{ player_id: playerBeId, injuries: response?.data?.injuries_history }, { new: true, upsert: true }),
        this.repoPlayerMappingStaging.findOneAndUpdate({ player_id: playerBeId }, { player_id: playerBeId, thesport_id: playerTSId }, { new: true, upsert: true }),
      ])
    }
    
    return true
  }
}
