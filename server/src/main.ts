import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/projects', projectRoutes)

app.get('/health', (_req, res) => {
  res.send('OK')
})

const port = process.env.PORT ?? 4000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
