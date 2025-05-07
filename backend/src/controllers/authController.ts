import {Request, Response} from "express"
import User from "../models/User"
import {generateToken} from "../utils/tokenUtils"
import {
  generateResetToken,
  sendPasswordResetEmail
} from "../utils/passwordUtils"
import bcrypt from "bcryptjs"

/**
 * Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const {identifier, password} = req.body // identifier can be username or email

    // Check if identifier and password are provided
    if (!identifier || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide username/email and password"
      })
      return
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{username: identifier}, {email: identifier}]
    }).select("+password")

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
        username: user.username,
        email: user.email
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
 * Register new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {username, email, password} = req.body

    // Check if required fields are provided
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide username, email and password"
      })
      return
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{username}, {email}]
    })

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists with this username or email"
      })
      return
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    })

    // Generate JWT token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

/**
 * Forgot password - send reset email
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {identifier} = req.body // identifier can be username or email

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: "Please provide username or email"
      })
      return
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{username: identifier}, {email: identifier}]
    })

    // Always return success, even if user not found (for security)
    if (!user) {
      res.status(200).json({
        success: true,
        message:
          "If your account exists, you will receive a password reset email"
      })
      return
    }

    // Generate reset token
    const resetToken = generateResetToken()

    // Set token and expiry in user document
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour
    await user.save()

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken, user.username)

    res.status(200).json({
      success: true,
      message: "If your account exists, you will receive a password reset email"
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}

/**
 * Reset password
 * @route PUT /api/auth/reset-password/:resetToken
 * @access Public
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {resetToken} = req.params
    const {password} = req.body

    if (!resetToken || !password) {
      res.status(400).json({
        success: false,
        message: "Invalid request"
      })
      return
    }

    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: {$gt: Date.now()}
    })

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      })
      return
    }

    // Update password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password reset successful"
    })
  } catch (error) {
    console.error("Reset password error:", error)
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
