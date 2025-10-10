import axios from "axios";
import {
  MappingPlayersRepositoryDev,
  MappingPlayersRepositoryStaging,
  PlayersCareersRepositoryDev,
  PlayersCareersRepositoryStaging,
  PlayersInjuriesRepositoryDev,
  PlayersInjuriesRepositoryStaging,
} from "../../router/router";
import { Pool } from "pg";

//--------------------------Connect 1 database------------------------------------
// import { PlayersInjuriesRepository } from '../repositories/playerInjuries.repository';
// import { MappingPlayersRepository } from '../repositories/mappingPlayers.repository';

//--------------------------Connect multiple database-----------------------------

export interface IPlayersService {
  getInjuryTypes(start: number, end: number): Promise<any>; // Crawl type injury của besoccer - 26500/4.000.000+ players
  syncInjuryPlayer(playerBeId: string, playerTSId: string): Promise<any>; // Sync dữ liệu 1-1 besoccer - thesport
  syncCareerPlayer(playerBeId: string, playerTSId: string): Promise<any>; // Sync dữ liệu 1-1 besoccer - thesport
  syncDataAverageRating(): Promise<any>; // Push data từ hiện tại cho đến quá khứ
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

  repoPlayerCareerDev: typeof PlayersCareersRepositoryDev;
  repoPlayerCareerStaging: typeof PlayersCareersRepositoryStaging;

  private pgPool: Pool;

  constructor(
    repoPlayerInjuryDev: typeof PlayersInjuriesRepositoryDev,
    repoPlayerMappingDev: typeof MappingPlayersRepositoryDev,
    repoPlayerInjuryStaging: typeof PlayersInjuriesRepositoryStaging,
    repoPlayerMappingStaging: typeof MappingPlayersRepositoryStaging,

    repoPlayerCareerDev: typeof PlayersCareersRepositoryDev,
    repoPlayerCareerStaging: typeof PlayersCareersRepositoryStaging,

    repository: Pool
  ) {
    this.repoPlayerInjuryDev = repoPlayerInjuryDev;
    this.repoPlayerMappingDev = repoPlayerMappingDev;
    this.repoPlayerInjuryStaging = repoPlayerInjuryStaging;
    this.repoPlayerMappingStaging = repoPlayerMappingStaging;

    this.repoPlayerCareerDev = repoPlayerCareerDev;
    this.repoPlayerCareerStaging = repoPlayerCareerStaging;

    this.pgPool = repository;
  }

  async getInjuryTypes(start: number, end: number): Promise<any> {
    const uniqueInjuries: any = {};

    for (let id = start; id <= end; id++) {
      try {
        const response = await axios.get(
          `https://fast.besoccer.com/scripts/api/api.php?req=player_injuries_st&format=json&v=657&appCountry=&lang=en&site=resultadosiPhone&key=825300886e6465fc5721a9ddbad0939a&device=iphone&id=${id}&vr=1`
        );
        const injuriesHistory = response.data.injuries_history;

        if (injuriesHistory && injuriesHistory.length > 0) {
          injuriesHistory.forEach((yearData: any) => {
            yearData.injuries_suspensions.forEach((injury: any) => {
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
    const response = await axios.get(
      `https://fast.besoccer.com/scripts/api/api.php?req=player_injuries_st&format=json&v=657&appCountry=&lang=en&site=resultadosiPhone&key=825300886e6465fc5721a9ddbad0939a&device=iphone&id=${playerBeId}&vr=1`
    );

    if (response?.data?.injuries_history?.length) {
      const result = await Promise.allSettled([
        this.repoPlayerInjuryDev.findOneAndUpdate(
          { player_id: playerBeId },
          { player_id: playerBeId, injuries: response?.data?.injuries_history },
          { new: true, upsert: true }
        ),
        this.repoPlayerMappingDev.findOneAndUpdate(
          { player_id: playerBeId },
          { player_id: playerBeId, thesport_id: playerTSId },
          { new: true, upsert: true }
        ),
        this.repoPlayerInjuryStaging.findOneAndUpdate(
          { player_id: playerBeId },
          { player_id: playerBeId, injuries: response?.data?.injuries_history },
          { new: true, upsert: true }
        ),
        this.repoPlayerMappingStaging.findOneAndUpdate(
          { player_id: playerBeId },
          { player_id: playerBeId, thesport_id: playerTSId },
          { new: true, upsert: true }
        ),
      ]);
    }

    return true;
  }

  async syncCareerPlayer(playerBeId: string, playerTSId: string): Promise<any> {
    const response = await axios.get(
      `https://fast.besoccer.com/scripts/api/api.php?req=player_teams_path_st&format=json&key=825300886e6465fc5721a9ddbad0939a&lang=en&site=ResultadosAndroid&id=${playerBeId}`
    );
    if (
      response?.data?.clubs?.length ||
      response?.data?.national_teams?.length ||
      response?.data?.career_summary?.length
    ) {
      const result = await Promise.allSettled([
        this.repoPlayerCareerDev.findOneAndUpdate(
          { player_id: playerBeId },
          {
            player_id: playerBeId,
            player_team_career: response?.data?.clubs,
            player_national_career: response?.data?.national_teams,
            player_summary_career: response?.data?.career_summary,
          },
          { new: true, upsert: true }
        ),
        this.repoPlayerMappingDev.findOneAndUpdate(
          { player_id: playerBeId },
          { player_id: playerBeId, thesport_id: playerTSId },
          { new: true, upsert: true }
        ),
        this.repoPlayerCareerStaging.findOneAndUpdate(
          { player_id: playerBeId },
          {
            player_id: playerBeId,
            player_team_career: response?.data?.clubs,
            player_national_career: response?.data?.national_teams,
            player_summary_career: response?.data?.career_summary,
          },
          { new: true, upsert: true }
        ),
        this.repoPlayerMappingStaging.findOneAndUpdate(
          { player_id: playerBeId },
          { player_id: playerBeId, thesport_id: playerTSId },
          { new: true, upsert: true }
        ),
      ]);
    }
    return true;
  }

  async syncDataAverageRating(): Promise<any> {
    try {
      console.log("Starting syncDataAverageRating");

      const batchSize = 1000; // Batch size for match_lineups
      const upsertBatchSize = 100; // Batch size for upserting players

      // Get total number of records
      const totalQuery = `SELECT COUNT(*) FROM public.match_lineups ml LEFT JOIN public.sport_events se ON ml.sport_event_id = se.id WHERE se.start_time IS NOT NULL;`;
      const { rows: totalRows } = await this.pgPool.query(totalQuery);
      const total = parseInt(totalRows[0].count, 10);
      const numBatches = Math.ceil(total / batchSize);

      console.log(`Processing total of ${total} records in ${numBatches} batches of ${batchSize} each.`);

      const query = `
        SELECT
          ml.sport_event_id,
          ml.home_lineups,
          ml.away_lineups,
          ml.home_injury,
          ml.away_injury,
          TO_CHAR(se.start_time::DATE, 'YYYY-MM') AS date
        FROM public.match_lineups ml
        LEFT JOIN public.sport_events se ON ml.sport_event_id = se.id
        WHERE se.start_time IS NOT NULL
        ORDER BY date DESC, ml.sport_event_id
        OFFSET $1 LIMIT $2;
      `;

      let totalInserted = 0;
      let totalSkipped = 0;

      // Hàm xử lý batch rating hoặc injury
      const processBatch = async (
        batch: [string, any][],
        batchType: 'rating' | 'injury',
        batchIndex: number,
        sport_event_id: string
      ) => {
        let insertedCount = 0;
        let skippedCount = 0;

        for (let j = 0; j < batch.length; j += upsertBatchSize) {
          const subBatch = batch.slice(j, j + upsertBatchSize);

          if (subBatch.length === 0) {
            console.log(`No players with valid ${batchType} in sub-batch ${j / upsertBatchSize + 1}, skipping upsert`);
            continue;
          }

          const promises = subBatch.map(async ([playerId, player]) => {
            const filteredInjury =
              player.injury && Object.keys(player.injury).length > 0
                ? {
                    type: player.injury.type,
                    reason: player.injury.reason,
                    end_time: player.injury.end_time,
                    position: player.injury.position,
                    start_time: player.injury.start_time,
                    missed_matches: player.injury.missed_matches,
                    match_id: player.injury.match_id,
                  }
                : null;

            try {
              await this.pgPool.query(
                `CALL upsert_player_rating_event(
                  $1::text,
                  $2::double precision,
                  $3::text,
                  $4::jsonb,
                  $5::text
                )`,
                [
                  player.playerId,
                  player.rating,
                  player.date,
                  filteredInjury ? JSON.stringify(filteredInjury) : null,
                  player.match_id,
                ]
              );
              return { success: true, playerId };
            } catch (error: any) {
              console.warn(
                `Failed to upsert player ${playerId} for match ${sport_event_id} in ${batchType} batch:`,
                error.message
              );
              return { success: false, playerId };
            }
          });

          const results = await Promise.all(promises);
          insertedCount += results.filter((r) => r.success).length;
          skippedCount += results.filter((r) => !r.success).length;
        }

        return { insertedCount, skippedCount };
      };

      for (let i = 0; i < numBatches; i++) {
        const offset = i * batchSize;

        try {
          const { rows } = await this.pgPool.query(query, [offset, batchSize]);
          console.log(`Fetched ${rows.length} rows for batch ${i + 1} (offset ${offset})`);

          let batchInserted = 0;
          let batchSkipped = 0;

          for (const row of rows) {
            const { sport_event_id, home_lineups, away_lineups, home_injury, away_injury, date } = row;

            // Skip if sport_event_id is missing
            if (!sport_event_id) {
              console.warn(`Skipping record with sport_event_id ${sport_event_id} due to missing sport_event_id`);
              batchSkipped++;
              continue;
            }

            // Map players from home_lineups, away_lineups, home_injury, away_injury
            const playerMap: { [key: string]: any } = {};

            // Process home_lineups
            (home_lineups || []).forEach((player: any) => {
              playerMap[player.id] = {
                playerId: player.id,
                rating: parseFloat(player.rating) || null,
                date,
                injury: null,
                match_id: sport_event_id,
              };
            });

            // Process away_lineups
            (away_lineups || []).forEach((player: any) => {
              if (!playerMap[player.id]) {
                playerMap[player.id] = {
                  playerId: player.id,
                  rating: parseFloat(player.rating) || null,
                  date,
                  injury: null,
                  match_id: sport_event_id,
                };
              } else {
                playerMap[player.id].rating = parseFloat(player.rating) || playerMap[player.id].rating;
              }
            });

            // Process home_injury
            (home_injury || []).forEach((injury: any) => {
              const injuryData = {
                type: injury.type,
                reason: injury.reason || null,
                end_time: injury.end_time,
                position: injury.position,
                start_time: injury.start_time,
                missed_matches: parseInt(injury.missed_matches) || 0,
                match_id: sport_event_id,
              };

              if (!playerMap[injury.id]) {
                playerMap[injury.id] = {
                  playerId: injury.id,
                  rating: null,
                  date,
                  injury: injuryData,
                  match_id: sport_event_id,
                };
              } else {
                playerMap[injury.id].injury = injuryData;
              }
            });

            // Process away_injury
            (away_injury || []).forEach((injury: any) => {
              const injuryData = {
                type: injury.type,
                reason: injury.reason || null,
                end_time: injury.end_time,
                position: injury.position,
                start_time: injury.start_time,
                missed_matches: parseInt(injury.missed_matches) || 0,
                match_id: sport_event_id,
              };

              if (!playerMap[injury.id]) {
                playerMap[injury.id] = {
                  playerId: injury.id,
                  rating: null,
                  date,
                  injury: injuryData,
                  match_id: sport_event_id,
                };
              } else {
                playerMap[injury.id].injury = injuryData;
              }
            });

            // Convert playerMap to array for batch upsert
            const playerEntries = Object.entries(playerMap);

            // Split into two batches: one for players with rating, one for players with injury
            const ratingBatch = playerEntries.filter(([, player]) => player.rating !== null);
            const injuryBatch = playerEntries.filter(([, player]) => player.injury !== null);

            // Process rating batch
            try {
              const { insertedCount, skippedCount } = await processBatch(
                ratingBatch,
                'rating',
                i + 1,
                sport_event_id
              );
              batchInserted += insertedCount;
              batchSkipped += skippedCount;
            } catch (error: any) {
              console.error(`Error processing rating batch for match ${sport_event_id}:`, error.message);
              batchSkipped += ratingBatch.length;
            }

            // Process injury batch
            try {
              const { insertedCount, skippedCount } = await processBatch(
                injuryBatch,
                'injury',
                i + 1,
                sport_event_id
              );
              batchInserted += insertedCount;
              batchSkipped += skippedCount;
            } catch (error: any) {
              console.error(`Error processing injury batch for match ${sport_event_id}:`, error.message);
              batchSkipped += injuryBatch.length;
            }

            console.log(
              `Batch ${i + 1} (offset ${offset}, match ${sport_event_id}): Successfully inserted ${batchInserted} records, skipped ${batchSkipped} records`
            );

            totalInserted += batchInserted;
            totalSkipped += batchSkipped;
          }
        } catch (error: any) {
          console.error(`Error processing batch ${i + 1} (offset ${offset}):`, error.message);
          totalSkipped += batchSize; // Skip entire batch on error
        }
      }

      console.log(
        `Total: Successfully inserted ${totalInserted} records, skipped ${totalSkipped} records`
      );
      return true;
    } catch (err) {
      console.error("Error syncing player rating and injury data:", err);
      throw err;
    }
  }
}
