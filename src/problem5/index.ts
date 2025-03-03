import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'

import productRouter from './Router/product'
import "./connect"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use("/v1", productRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});