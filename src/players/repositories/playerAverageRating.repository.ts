import { Pool } from 'pg';

export interface Injury {
  type: string;
  reason: string;
  team_id: string;
  end_time: string;
  match_id: string;
  position: string;
  start_time: string;
  missed_matches: string;
}

// Định nghĩa interface cho entity PlayerAverageRating
export interface AverageRatingEntity {
  player_id: string;
  date: string;
  total_rating: number;
  total_matches: number;
  injuries: any;
  events: any;
  injuries_detail: Injury[];
}

// Định nghĩa schema cho bảng average_rating
export const AverageRatingSchema = `
  CREATE TABLE IF NOT EXISTS test_average_rating (
    player_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    total_rating FLOAT,
    total_matches INTEGER,
    injuries INTEGER,
    events TEXT,
    injuries_detail TEXT,
    PRIMARY KEY (player_id, date)
  );
`;

// Hàm tạo repository cho average_rating
export const createAverageRatingRepository = (pgPool: Pool) => {
  // Khởi tạo bảng khi repository được tạo
  pgPool.query(AverageRatingSchema).catch((err) => {
    console.error('Error creating average_rating table:', err);
  });

  return pgPool;
};