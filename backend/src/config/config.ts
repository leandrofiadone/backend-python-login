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
  email?: {
    host: string
    port: number
    secure: boolean
    user: string
    password: string
    from: string
  }
  app?: {
    frontendUrl: string
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
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.example.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER || "user@example.com",
    password: process.env.EMAIL_PASSWORD || "password",
    from: process.env.EMAIL_FROM || '"SuperLab" <noreply@superlab.com>'
  },
  app: {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
  }
}

export default config
