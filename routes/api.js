import express from 'express'
import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/pine-crawler', {
  useMongoClient: true
})

const router = express.Router()

router.get('/courses', (req, res, next) => {
  // do stuff here
  console.log('GET request for courses')
  
  res.send('this is a test')
})

export default router
