import express from 'express'
import mongoose from 'mongoose'
import path from 'path'

mongoose.connect('mongodb://localhost/pine-crawler', {
  useMongoClient: true
})

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')

// app.get('/', (req, res) => {
//   console.log('got a request')
//   res.send('Hello, world!')
//   
//   // timetable.saveTimetableInfo()
//   registrar.getAll()
// })

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.listen(8080, () => {
  console.log('App is listening on port 8080')
})
