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
      select: false // Don't include password in query results by default
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

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next()

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (error: any) {
    return next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model<IUser>("User", UserSchema)

export default User
