import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { env } from '../config/env.js'
import * as schema from './schema.js'

declare const process: any;

const sql = neon(env.db.url)
export const db = drizzle(sql, { schema })
