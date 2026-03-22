import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 3002

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// статика (будущий React билд)
app.use(express.static(path.join(__dirname, 'dist')))

// API пример
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// отдача фронта
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
