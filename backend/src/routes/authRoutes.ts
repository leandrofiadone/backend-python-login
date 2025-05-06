import express from "express"
import {login, getMe} from "../controllers/authController"
import {protect} from "../middleware/authMiddleware"

const router = express.Router()

// Public routes
router.post("/login", login)

// Protected routes
router.get("/me", protect, getMe)

export default router
