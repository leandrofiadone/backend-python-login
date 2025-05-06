import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

interface Config {
  server: {
    port: string | number
    nodeEnv: string
  }
  database: {
    uri: string
  }
  jwt: {
    secret: string
    expiresIn: string
  }
  cors: {
    origin: string
  }
}

const config: Config = {
  server: {
    port: process.env.PORT || 8000,
    nodeEnv: process.env.NODE_ENV || "development"
  },
  database: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/superlab"
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d"
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*"
  }
}

export default config
