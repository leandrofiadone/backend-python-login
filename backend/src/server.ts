import app from "./app"
import config from "./config/config"
import connectDB from "./config/db"

// Connect to MongoDB
connectDB()

// Start server
const PORT = config.server.port
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.server.nodeEnv} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error(`Unhandled Rejection: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
