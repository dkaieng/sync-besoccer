import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'

import playerRouter from '../router/router'
import "./connect"

const app = express()
const PORT = process.env.PORT_PLAYERS || 1000

app.use(cors())
app.use(bodyParser.json())
app.use("/api/v1", playerRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});