import express from 'express'
import mongoose from 'mongoose'
import path from 'path'

// routes
import api from './routes/api'

// models
import './models/course.js'

mongoose.connect('mongodb://localhost/pine-crawler', {
  useMongoClient: true
})

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', { title: 'Pine Crawler', message: 'Hello there!' })
})

app.use('/api', api)

app.listen(8080, () => {
  console.log('App is listening on port 8080')
})
