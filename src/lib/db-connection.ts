import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODO_URI doesn't exists in environment variables");
}

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected Successfully");
  } catch (err) {
    console.log("MongoDB connection failed", err);
    process.exit(1);
  }
}
