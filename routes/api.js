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

router.get('/subjects', (req, res) => {
  mongoose.model('Course').find().distinct('subj', (err, subjects) => {
    if (err) {
      return console.error(err)
    }
    res.json(subjects.sort())
  })
})

router.get('/distrib-counts/:distrib', (req, res) => {
  // TODO continue writing aggregation thing here
  mongoose.model('Course').aggregate([
    { $match: {distribs: {$regex: req.params.distrib }} },
    { $group: {_id: {subj: '$subj'}, count: { $sum: 1 }}}
  ], (err, counts) => {
    if (err) {
      return console.error(err)
    }
    res.json(counts.sort((a,b) => { return b.count - a.count }))
  })
})

export default router
