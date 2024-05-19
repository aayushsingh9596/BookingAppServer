import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_CONNECTION_URL as string
    );
    console.log("connected to db", conn.connection.host);
  } catch (error) {
    console.log("failed to connectDb", error);
    process.exit(1);
  }
};

export default connectDb;
