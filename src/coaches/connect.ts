import * as dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

const envPath = path.join(__dirname, "../../.env");
dotenv.config({ path: envPath });

// --------------------------Connect PostgreSQL-----------------------------
const pgConfig = {
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || "5432"), // Mặc định là 5432 nếu không có giá trị
};

// Kiểm tra các biến môi trường cần thiết cho PostgreSQL
const requiredPgEnvVars = [
  "DATABASE_USERNAME",
  "DATABASE_HOST",
  "DATABASE_NAME",
  "DATABASE_PASSWORD",
  "DATABASE_PORT",
];

const missingPgEnvVars = requiredPgEnvVars.filter((varName) => !process.env[varName]);

if (missingPgEnvVars.length > 0) {
  console.error(`Missing PostgreSQL environment variables: ${missingPgEnvVars.join(", ")}`);
  process.exit(1);
}

// Tạo pool kết nối PostgreSQL
const pgPool = new Pool(pgConfig);

// Kiểm tra kết nối đến PostgreSQL
pgPool
  .connect()
  .then((client: any) => {
    console.log("Connected to PostgreSQL");
    client.release(); // Giải phóng client sau khi kiểm tra
  })
  .catch((err: any) => {
    console.error("Could not connect to PostgreSQL:", err);
    process.exit(1);
  });

// Export pgPool để sử dụng ở các nơi khác trong ứng dụng
export { pgPool };