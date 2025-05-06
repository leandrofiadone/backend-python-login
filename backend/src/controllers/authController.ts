import {Request, Response} from "express"
import User from "../models/User"
import {generateToken} from "../utils/tokenUtils"

/**
 * Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const {username, password} = req.body

    // Check if username and password are provided
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide username and password"
      })
      return
    }

    // Find user by username
    const user = await User.findOne({username}).select("+password")

    // Check if user exists
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      })
      return
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      })
      return
    }

    // Generate JWT token
    const token = generateToken(user)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user

    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}
