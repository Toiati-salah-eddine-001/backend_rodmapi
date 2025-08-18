import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from "dotenv"

// Load environment variables
config()

async function main() {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set')
    }
    
    const client = postgres(databaseUrl)
    const db = drizzle(client)
    
    console.log('Database connection established successfully')
}

main().catch(console.error)
