import crypto from "crypto"
import nodemailer from "nodemailer"
import config from "../config/config"

/**
 * Generate a random reset token
 * @returns {string} Random token string
 */
export const generateResetToken = (): string => {
  return crypto.randomBytes(20).toString("hex")
}

/**
 * Set up nodemailer transporter
 * Note: You'll need to configure your SMTP settings in the config file
 */
const createTransporter = () => {
  // For production, replace with your actual SMTP configuration
  return nodemailer.createTransport({
    host: config.email?.host || "smtp.example.com",
    port: config.email?.port || 587,
    secure: config.email?.secure || false,
    auth: {
      user: config.email?.user || "user@example.com",
      pass: config.email?.password || "password"
    }
  })
}

/**
 * Send password reset email
 * @param {string} email Recipient email
 * @param {string} resetToken Reset token
 * @param {string} username User's username
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  username: string
): Promise<void> => {
  try {
    const transporter = createTransporter()

    const resetUrl = `${
      config.app?.frontendUrl || "http://localhost:5173"
    }/reset-password/${resetToken}`

    const mailOptions = {
      from: config.email?.from || '"SuperLab" <noreply@superlab.com>',
      to: email,
      subject: "Restablecimiento de contraseña",
      html: `
        <h1>Hola, ${username}</h1>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Por favor, haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}" target="_blank">Restablecer contraseña</a>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no has solicitado este cambio, por favor ignora este mensaje.</p>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log("Password reset email sent to:", email)
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw new Error("Error sending password reset email")
  }
}
