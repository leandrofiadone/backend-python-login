import express, {Request, Response, NextFunction} from "express"
import cors from "cors"
import morgan from "morgan"
import config from "./config/config"
import authRoutes from "./routes/authRoutes"

// Initialize express app
const app = express()

// Middleware
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({extended: true})) // Parse URL-encoded bodies

// Enable CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true
  })
)

// HTTP request logger
if (config.server.nodeEnv === "development") {
  app.use(morgan("dev"))
}

// Routes
app.use("/auth", authRoutes)

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({status: "ok", message: "Server is up and running"})
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({success: false, message: "Endpoint not found"})
})

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    message:
      config.server.nodeEnv === "development" ? err.message : "Server error"
  })
})

export default app
