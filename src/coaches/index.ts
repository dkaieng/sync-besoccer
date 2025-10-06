import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'

import { coachRouter } from '../router/router'
import "./connect"

const app = express()
const PORT = process.env.PORT_COACHES || 1001

app.use(cors())
app.use(bodyParser.json())
app.use("/api/v1", coachRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});