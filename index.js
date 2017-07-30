import express from 'express'
import * as timetable from './timetable.js'
import * as registrar from './registrar.js'
const app = express()

app.get('/', (req, res) => {
  console.log('got a request')
  res.send('Hello, world!')
  
  // timetable.saveTimetableInfo()
  registrar.getAll()
})

app.listen(8080, () => {
  console.log('App is listening on port 8080')
})
