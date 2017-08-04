import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

router.get('/', function (req, res) {
  res.render('index', { title: 'Pine Crawler', message: 'Hello there!' })
})

router.get('/search', function(req, res) {
  res.render('search')
})

export default router
