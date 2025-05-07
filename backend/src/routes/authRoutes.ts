import express from "express"
import {
  login,
  getMe,
  register,
  forgotPassword,
  resetPassword
} from "../controllers/authController"
import {protect} from "../middleware/authMiddleware"

const router = express.Router()

// Public routes
router.post("/login", login)
router.post("/register", register)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:resetToken", resetPassword)

// Protected routes
router.get("/me", protect, getMe)

export default router
