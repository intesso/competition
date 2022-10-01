import dotenv from 'dotenv'
import { app } from './app'
dotenv.config()

const port = process.env.PORT || 8081
app.listen(port)
console.info(`Listening to http://localhost:${port} 🚀`)
