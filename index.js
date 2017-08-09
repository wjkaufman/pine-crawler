import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'

// routes
import api from './routes/api'
import index from './routes/index'

// models
import './models/course.js'

mongoose.connect('mongodb://localhost/pine-crawler', {
  useMongoClient: true
})

const app = express()

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
// for logging purposes
app.use(morgan('combined'))

app.use('/api', api)
app.use('/', index)

app.listen(8080, () => {
  console.log('App is listening on port 8080')
})
