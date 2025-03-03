import * as dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

const envPath = path.join(__dirname, "../../.env");
dotenv.config({ path: envPath });

const mongoURI = process.env.MONGODB_CONNECTION_STRING;
if (!mongoURI) {
  console.error("MONGODB_CONNECTION_STRING is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: any) => {
    console.error("Could not connect to MongoDB:", err);
    process.exit(1);
  });
