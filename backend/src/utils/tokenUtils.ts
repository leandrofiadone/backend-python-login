import jwt from "jsonwebtoken"
import config from "../config/config"
import {IUser} from "../models/User"

/**
 * Generate a JWT token for the user
 * @param user The user object to generate token for
 * @returns JWT token string
 */
export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {id: user._id, username: user.username},
    config.jwt.secret as string, // Aseguramos que sea string
    {expiresIn: typeof config.jwt.expiresIn === "string" ? parseInt(config.jwt.expiresIn, 10) : config.jwt.expiresIn} // Ensure expiresIn is a valid number
  )
}

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Extract token from request headers
 * @param authorization Authorization header value
 * @returns Token string or null if not found
 */
export const extractTokenFromHeader = (
  authorization?: string
): string | null => {
  if (!authorization) return null

  const parts = authorization.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") return null

  return parts[1]
}
