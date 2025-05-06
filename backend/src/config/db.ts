import mongoose from "mongoose"
import config from "./config"

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.database.uri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`)
    } else {
      console.error("Unknown error connecting to MongoDB")
    }
    process.exit(1)
  }
}

export default connectDB
