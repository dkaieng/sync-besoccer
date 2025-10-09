import { Pool } from 'pg';

export interface ICoachesService {
    syncDataH2HCoaches(): Promise<any>
}

export default class CoachesService implements ICoachesService {
  private pgPool: Pool;

  constructor(repository: Pool) {
    this.pgPool = repository;
  }

  async syncDataH2HCoaches(): Promise<any> {
    try {
      const batchSize = 20000;

      // Get total number of records
      const totalQuery = `SELECT COUNT(*) FROM public.sport_events;`;
      const { rows: totalRows } = await this.pgPool.query(totalQuery);
      const total = parseInt(totalRows[0].count, 10);
      const numBatches = Math.ceil(total / batchSize);

      console.log(`Processing total of ${total} records in ${numBatches} batches of ${batchSize} each.`);

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
          (
            SELECT ccr.coach_id
            FROM public.coach_coaching_resumes ccr
            WHERE ccr.team_id = t.home_team_id
              AND ccr.position = 1
              AND t.start_timestamp >= ccr.joined
              AND (ccr.contract_until IS NULL OR ccr.contract_until = 0 OR t.start_timestamp <= ccr.contract_until)
            ORDER BY ccr.joined DESC
            LIMIT 1
          ) AS home_coach_id,
          (
            SELECT ccr.coach_id
            FROM public.coach_coaching_resumes ccr
            WHERE ccr.team_id = t.away_team_id
              AND ccr.position = 1
              AND t.start_timestamp >= ccr.joined
              AND (ccr.contract_until IS NULL OR ccr.contract_until = 0 OR t.start_timestamp <= ccr.contract_until)
            ORDER BY ccr.joined DESC
            LIMIT 1
          ) AS away_coach_id
        FROM public.sport_events AS t
        ORDER BY t.id
        OFFSET $1 LIMIT $2;
      `;

      let totalInserted = 0;
      let totalSkipped = 0;

      for (let i = 0; i < numBatches; i++) {
        const offset = i * batchSize;
        const { rows } = await this.pgPool.query(query, [offset, batchSize]);

        console.log(`Fetched ${rows.length} rows for batch ${i + 1} (offset ${offset})`);
        console.log(rows, '===rows');

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
              winner_code
            ) VALUES ($1, $2, $3, $4)
            ON CONFLICT (sport_event_id) DO NOTHING;
          `;

          const winnerCode = row.result_event === 'home' ? '1' : row.result_event === 'away' ? '2' : '3';

          const values = [
            row.id,
            row.home_coach_id,
            row.away_coach_id,
            winnerCode,
          ];

          await this.pgPool.query(insertQuery, values);
          insertedCount++;
        }

        console.log(`Batch ${i + 1} (offset ${offset}): Successfully inserted ${insertedCount} records, skipped ${skippedCount} records`);

        totalInserted += insertedCount;
        totalSkipped += skippedCount;
      }

      console.log(`Total: Successfully inserted ${totalInserted} records, skipped ${totalSkipped} records`);
      return true;
    } catch (err) {
      console.error('Error syncing H2H coaches data:', err);
      throw err;
    }
  }
}