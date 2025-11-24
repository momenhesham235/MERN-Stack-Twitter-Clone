import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "backend/src/config/.env" });

class DatabaseSingleton {
  constructor() {
    if (DatabaseSingleton.instance) return DatabaseSingleton.instance;

    DatabaseSingleton.instance = this;
    this.connect();
    return this;
  }

  async connect() {
    try {
      const uri = process.env.MONGO_URI;

      if (!uri) throw new Error("❌ MONGO_URI missing in .env");

      const conn = await mongoose.connect(uri );
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.error("❌ MongoDB Connection Error:", err.message);
      process.exit(1);
    }
  }
}

export default new DatabaseSingleton();
