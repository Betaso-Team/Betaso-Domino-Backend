import mongoose from 'mongoose'

import env from '@/env'

// Conexión centralizada
export async function connectMongoDB() {
  try {
    await mongoose.connect(env.MONGO_URI)

    mongoose.connection.on('error', (err: Error) => {
      console.error('❌ MongoDB connection error:', err)
    })

    return mongoose.connection
  }
  catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export const mongooseConnection = mongoose.connection
