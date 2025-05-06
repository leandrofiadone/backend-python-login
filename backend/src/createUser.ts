import dotenv from "dotenv"
dotenv.config()

import mongoose, {Document, Schema} from "mongoose"
import bcrypt from "bcryptjs"

// Definimos una interfaz para el Usuario (esto es un tipo TypeScript)
interface IUser extends Document {
  username: string
  password: string
}

// Creamos el esquema de usuario, asegurándonos de que los tipos sean correctos
const userSchema: Schema<IUser> = new Schema(
  {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  },
  {timestamps: true}
)

// Aplicamos el hash a la contraseña antes de guardar al usuario
userSchema.pre("save", async function (next) {
  const user = this as IUser // Esto es para decirle a TypeScript que 'this' es de tipo IUser
  if (!user.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    next()
  } catch (err) {
    next(err as mongoose.CallbackError)
  }
})

// Creamos el modelo de usuario con el esquema
const User = mongoose.model<IUser>("User", userSchema)

// Función para crear un usuario
async function createUser(username: string, password: string): Promise<void> {
  try {
    // Nos conectamos a la base de datos
    await mongoose.connect(process.env.MONGODB_URI || "", {
      // Removed deprecated options as they are now defaults in Mongoose
    })

    // Creamos el usuario
    const newUser = new User({username, password})
    await newUser.save()

    console.log("Usuario creado exitosamente!")
  } catch (err) {
    console.error("Error al crear el usuario:", err)
  } finally {
    mongoose.connection.close()
  }
}

// Llamamos a la función para crear el usuario
createUser("leandro", "fiadone")
