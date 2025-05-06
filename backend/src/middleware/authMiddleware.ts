import {Request, Response, NextFunction} from "express"
import {extractTokenFromHeader, verifyToken} from "../utils/tokenUtils"
import User from "../models/User"

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

/**
 * Middleware to protect routes - verifies JWT token
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const token = extractTokenFromHeader(req.headers.authorization)

    if (!token) {
      res
        .status(401)
        .json({success: false, message: "Not authorized, no token"})
      return
    }

    // Verify token
    const decoded = verifyToken(token)

    if (!decoded) {
      res
        .status(401)
        .json({success: false, message: "Not authorized, token failed"})
      return
    }

    // Check if user exists
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      res.status(401).json({success: false, message: "User not found"})
      return
    }

    // Set user in request
    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res
      .status(401)
      .json({success: false, message: "Not authorized, token failed"})
  }
}
