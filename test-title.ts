import { config } from "dotenv"
config({path: "./backend/.env"})
import { Groq } from 'groq-sdk'
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function run() {
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'hello world' }],
      model: 'groq/compound-mini',
      max_completion_tokens: 15,
    })
    console.log("Success:", response.choices[0].message.content)
  } catch (error) {
    console.error("Error:", error.message)
  }
}
run()
