import dotenv from "dotenv"
dotenv.config()

import mongoose, {Document, Schema} from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  username: string
  email: string
  password: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"]
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ]
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false
    },
    resetPasswordToken: {
      type: String,
      select: false
    },
    resetPasswordExpires: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
)

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err as mongoose.CallbackError)
  }
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model<IUser>("User", UserSchema)
export default User

// Función de ejemplo para crear un usuario
async function createUser(
  username: string,
  email: string,
  password: string
): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "")
    const newUser = new User({username, email, password})
    await newUser.save()
    console.log("Usuario creado exitosamente!")
  } catch (err) {
    console.error("Error al crear el usuario:", err)
  } finally {
    await mongoose.connection.close()
  }
}

// Llamada de ejemplo
createUser("leandrito", "leandro@email.com", "fiadone123")
