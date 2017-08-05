import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'
import mongoose from 'mongoose'
import '../models/course.js'


mongoose.connect('mongodb://localhost/pine-crawler', {
  useMongoClient: true
})

const Course = mongoose.model('Course')


// const Course = mongoose.model('Course')

const courseURLs = JSON.parse(fs.readFileSync('data/orc_course_urls.json', 'utf8'))

const courseAttribs = {
  'Prerequisite': 'prereq',
  'Department-Specific Course Categories': 'course-cat',
  'Cross Listed Courses': 'xlisted',
  'Distributive and/or World Culture': 'genedreq'
}

console.log(`Loaded ${courseURLs.length} course urls`)

let courses = []
let coursesRecieved = 0
let coursesErr = 0
let totalRequests = courseURLs.length

for (let i = 0; i < courseURLs.length; i++) {
  let url = courseURLs[i]
  // if (url.indexOf('ANTH') <= 0) { // FOR DEBUGGING PURPOSES
  //   totalRequests --
  //   continue
  // }
  // wait for a random amount of time (0-40 seconds)
  // so that the server doesn't freak out
  setTimeout(function() {
    request(url, (err, res, html) => {
      if (err) {
        coursesErr ++
        return console.error(err + ` (${url})`)
      }
      
      const course = scrapeCoursePage(html, url)
      
      courses.push(course)
      coursesRecieved ++
      console.log(`coursesRecieved: ${coursesRecieved} (/${totalRequests})`)
      
      // todo write to mongodb here (probably more efficient
      // than writing all at once)
      
      Course.create(course, function (err, c) {
        if (err) {
          return console.error(err)
        }
      })
      
      // other stuff (to do when it's all done)
      
      if (coursesRecieved + coursesErr === totalRequests - 1) {
        // writeCourses(courses)
        console.log(`done scraping course URLs (${coursesErr} failed)`)
        return 0
      }
    })
  }, Math.random()*1000*80) // 40 seconds seems to work consistently well
}

/*
  function to scrape all the important information from a course page
  
  html: the actual html of the page
  url: url of the page
*/
function scrapeCoursePage(html, url) {
  
  const $ = cheerio.load(html)
  
  let course = {}
  const title = $('#main > h1').text().trim().split(' ')
  course.title = title.slice(2).join(' ')
  course.subj = title[0]
  course.num = Number(title[1]) || title[1]
  course.url = url
  course.desc = $('#main > div.desc > p').text().trim()
  course.instructor = $('#instructor').text()
                    .replace('Instructor','').trim()
  course.offered = $('#offered').text().replace('Offered','').trim()
  
  // "other" is a bit tricky, and most likely to fail
  // this gets info like prereq, distribs, cross listed courses
  const other = $('#main').clone().children('h1, div')
                    .remove().end().text().trim().split('\n')
  let attrib = undefined
  for (let i = 0; i < other.length; i++) {
    if (attrib === undefined) {
      attrib = other[i].trim() // set next attribute type
    } else {
      // set next attribute
      course[courseAttribs[attrib] || attrib] = other[i]
      attrib = undefined // get ready for next attribute assignment
    }
  }
  return course
}

/*
  Finally, write courses to file
*/
function writeCourses(courses) {
  console.log('Writing data to file')
  // writing to file
  fs.writeFile('data/orc_courses.json', JSON.stringify(courses), (err) => {
    console.error(err)
  })
}
