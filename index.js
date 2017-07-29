import express from 'express'
import * as timetable from './timetable.js'
const app = express()

app.get('/', (req, res) => {
  console.log('got a request')
  res.send('Hello, world!')
  
  console.log(timetable)
  
  timetable.saveTimetableInfo()
})

app.listen(8080, () => {
  console.log('App is listening on port 8080')
})
