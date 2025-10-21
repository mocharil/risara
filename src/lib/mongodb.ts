import { MongoClient, Db } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017'
const DB_NAME = 'risara'

// Create client configuration
let client: MongoClient
let db: Db

async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    client = new MongoClient(MONGO_URI)
    await client.connect()
    db = client.db(DB_NAME)

    console.log('Connected to MongoDB successfully')
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export async function getDatabase(): Promise<Db> {
  if (!db) {
    const connection = await connectToDatabase()
    return connection.db
  }
  return db
}

export async function getTikTokCollection() {
  const database = await getDatabase()
  return database.collection('tiktok_data')
}

export async function getInsightTikTokCollection() {
  const database = await getDatabase()
  return database.collection('insight_tiktok_jakarta')
}

export async function getNewsCollection() {
  const database = await getDatabase()
  return database.collection('news_data')
}

export async function getInsightNewsCollection() {
  const database = await getDatabase()
  return database.collection('insight_news_jakarta')
}
