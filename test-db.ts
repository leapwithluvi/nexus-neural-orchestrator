import { config } from "dotenv"
config({path: "./backend/.env"})
import { db } from "./backend/src/db/client"
import { conversations } from "./backend/src/db/schema"
async function run() {
  const result = await db.select().from(conversations).limit(5)
  console.log(result.map(r => r.title))
}
run()
