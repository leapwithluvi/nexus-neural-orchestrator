import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../config/env.js'
import * as schema from './schema.js'

declare const process: any;

const queryClient = postgres(env.db.url)

export const db = drizzle(queryClient, { schema })
