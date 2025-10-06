import { Pool } from 'pg';

export interface ICoachesService {
    syncDataH2HCoaches(start: number, end: number): Promise<any>
}

export default class CoachesService implements ICoachesService {
  private pgPool: Pool;

  constructor(repository: Pool) {
    this.pgPool = repository;
  }

  async syncDataH2HCoaches(start: number, end: number): Promise<any> {
    try {
      const batchSize = end - start + 1;
      console.log(batchSize,"===batchSize")
      const query = `
        SELECT 
          t.id,
          t.start_time,
          t.start_timestamp,
          t.sport_event_status,
          t.home_team_id,
          t.away_team_id,
          CASE
            WHEN COALESCE((t.sport_event_status->'home_score'->>'regular_score')::int, 0) +
                 COALESCE((t.sport_event_status->'home_score'->>'overTime_score')::int, 0) +
                 COALESCE((t.sport_event_status->'home_score'->>'penalty_score')::int, 0) >
                 COALESCE((t.sport_event_status->'away_score'->>'regular_score')::int, 0) +
                 COALESCE((t.sport_event_status->'away_score'->>'overTime_score')::int, 0) +
                 COALESCE((t.sport_event_status->'away_score'->>'penalty_score')::int, 0)
              THEN 'home'
            WHEN COALESCE((t.sport_event_status->'home_score'->>'regular_score')::int, 0) +
                 COALESCE((t.sport_event_status->'home_score'->>'overTime_score')::int, 0) +
                 COALESCE((t.sport_event_status->'home_score'->>'penalty_score')::int, 0) <
                 COALESCE((t.sport_event_status->'away_score'->>'regular_score')::int, 0) +
                 COALESCE((t.sport_event_status->'away_score'->>'overTime_score')::int, 0) +
                 COALESCE((t.sport_event_status->'away_score'->>'penalty_score')::int, 0)
              THEN 'away'
            ELSE 'draw'
          END AS result_event,
          (SELECT ccr.coach_id 
           FROM public.coach_coaching_resumes ccr 
           WHERE ccr.team_id = t.home_team_id 
           AND ccr.position = 1
           AND t.start_timestamp >= ccr.joined 
           AND (ccr.contract_until IS NULL OR ccr.contract_until = 0 OR t.start_timestamp <= ccr.contract_until)
           ORDER BY ccr.joined DESC
           LIMIT 1) AS home_coach_id,
          (SELECT ccr.coach_id 
           FROM public.coach_coaching_resumes ccr 
           WHERE ccr.team_id = t.away_team_id 
           AND ccr.position = 1
           AND t.start_timestamp >= ccr.joined 
           AND (ccr.contract_until IS NULL OR ccr.contract_until = 0 OR t.start_timestamp <= ccr.contract_until)
           ORDER BY ccr.joined DESC
           LIMIT 1) AS away_coach_id
        FROM public.sport_events AS t
        ORDER BY t.id
        OFFSET $1 LIMIT $2;
      `
      const { rows } = await this.pgPool.query(query, [start, batchSize]);
      console.log(`Fetched ${rows.length} rows for batch ${start} to ${end}`);
      console.log(rows,"===rows")
      
      // Map and insert each valid record into h2h_coaches
      let insertedCount = 0;
      let skippedCount = 0;
      for (const row of rows) {
        // Skip records where home_coach_id or away_coach_id is null due to NOT NULL constraint
        if (!row.home_coach_id || !row.away_coach_id) {
          console.warn(`Skipping record with sport_event_id ${row.id} due to null coach_id`);
          skippedCount++;
          continue;
        }

        const insertQuery = `
          INSERT INTO public.h2h_coaches (
            sport_event_id,
            home_coach_id,
            away_coach_id,
            home_coach_win,
            draw,
            away_coach_win
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (sport_event_id) DO NOTHING;
        `;

        const values = [
          row.id,
          row.home_coach_id,
          row.away_coach_id,
          row.result_event === 'home',
          row.result_event === 'draw',
          row.result_event === 'away',
        ];

        await this.pgPool.query(insertQuery, values);
        insertedCount++;
      }

      console.log(`Batch ${start} to ${end}: Successfully inserted ${insertedCount} records, skipped ${skippedCount} records`);
      return true;
    } catch (err) {
      console.error('Error syncing H2H coaches data:', err);
      throw err;
    }
  }
}