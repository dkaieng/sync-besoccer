import * as dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

const envPath = path.join(__dirname, "../../.env");
dotenv.config({ path: envPath });
//--------------------------Connect 1 database-----------------------------

// const mongoURI = process.env.MONGODB_CONNECTION_STRING_DEV;
// // const mongoURI = process.env.MONGODB_CONNECTION_STRING_STAGING;

// if (!mongoURI) {
//   console.error("MONGODB_CONNECTION_STRING is not defined in .env file");
//   process.exit(1);
// }

// Connect to MongoDB
// mongoose.connect(mongoURI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err: any) => {
//     console.error("Could not connect to MongoDB:", err);
//     process.exit(1);
//   });

//--------------------------Connect multiple database-----------------------------

const mongoURI1 = process.env.MONGODB_CONNECTION_STRING_DEV;
const mongoURI2 = process.env.MONGODB_CONNECTION_STRING_STAGING;

if (!mongoURI1 || !mongoURI2) {
  console.error("One or both MongoDB connection strings are not defined in .env file");
  process.exit(1);
}

const conn1 = mongoose.createConnection(mongoURI1);
const conn2 = mongoose.createConnection(mongoURI2);

// Lắng nghe sự kiện kết nối
conn1.on('connected', () => {
  console.log("Connected to MongoDB instance 1");
});

conn2.on('connected', () => {
  console.log("Connected to MongoDB instance 2");
});

// Xử lý lỗi kết nối
conn1.on('error', (err) => {
  console.error("Could not connect to MongoDB instance 1:", err);
  process.exit(1);
});

conn2.on('error', (err) => {
  console.error("Could not connect to MongoDB instance 2:", err);
  process.exit(1);
});

export { conn1, conn2 };