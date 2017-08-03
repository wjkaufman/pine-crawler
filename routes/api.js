import express from 'express'
import mongoose from 'mongoose'

// mongoose.connect('mongodb://localhost/pine-crawler', {
//   useMongoClient: true
// })

const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', { title: 'API', message: 'Welcome to the API!' })
})

router.get('/courses', (req, res) => {
  // do stuff here
  console.log('GET request for courses')
  const query = {}
  if (req.query.subj) {
    query.subj = req.query.subj
  }
  mongoose.model('Course').find(query).sort({num: 1}).exec((err, courses) => {
    if (err) {
      return console.error(err)
    }
    console.log('got stuff from the db')
    res.json(courses)
  })
})

export default router
