/*
  Defines the course model for mongoose storage
*/
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title: String,
  subj: String,
  num: String, // interesting that a number should be stored as a string...
  url: String,
  desc: String,
  instructor: String,
  offered: String,
  distribs: String,
  wc: String,
  xlisted: String,
  prereq: String
})

// not sure if this is right, I think it is

mongoose.model('Course', courseSchema)
