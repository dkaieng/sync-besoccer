import { Pool } from 'pg';

// Định nghĩa interface cho entity H2HCoaches
export interface H2HCoachesEntity {
  sport_event_id: string;
  home_coach_id: string;
  away_coach_id: string;
  home_coach_win: boolean;
  draw: boolean;
  away_coach_win: boolean;
}

// Định nghĩa schema cho bảng h2h_coaches
export const H2HCoachesSchema = `
  CREATE TABLE IF NOT EXISTS h2h_coaches (
    sport_event_id VARCHAR(255) PRIMARY KEY,
    home_coach_id VARCHAR(255) NOT NULL,
    away_coach_id VARCHAR(255) NOT NULL,
    home_coach_win BOOLEAN DEFAULT FALSE,
    draw BOOLEAN DEFAULT FALSE,
    away_coach_win BOOLEAN DEFAULT FALSE
  );
`;

// Hàm tạo repository cho h2h_coaches
export const createH2HCoachesRepository = (pgPool: Pool) => {
  // Khởi tạo bảng khi repository được tạo
  pgPool.query(H2HCoachesSchema).catch((err) => {
    console.error('Error creating h2h_coaches table:', err);
  });

  return pgPool;
};