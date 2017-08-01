import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

const courseURLs = JSON.parse(fs.readFileSync('data/orc_course_urls.json', 'utf8'))

const courseAttribs = {
  'Prerequisite': 'prereq',
  'Department-Specific Course Categories': 'course-cat',
  // 'Distributive and/or World Culture': 'dist'
}

console.log(`Loaded ${courseURLs.length} course urls`)

let courses = []
let coursesRecieved = 0
let totalRequests = courseURLs.length

for (let i = 0; i < courseURLs.length; i++) {
  let url = courseURLs[i]
  // if (url.indexOf('PHYS') <= 0) { // FOR DEBUGGING PURPOSES
  //   totalRequests --
  //   continue
  // }
  // wait for a random amount of time (0-40 seconds)
  // so that the server doesn't freak out
  setTimeout(function() {
    request(url, (err, res, html) => {
      if (err) {
        return console.error(err + ` (${url})`)
      }
      
      const course = scrapeCoursePage(html, url)
      
      courses.push(course)
      coursesRecieved ++
      console.log(`coursesRecieved: ${coursesRecieved} (/${totalRequests})`)
      
      // todo write to mongodb here (probably more efficient
      // than writing all at once)
      
      if (coursesRecieved === totalRequests) {
        writeCourses(courses)
      }
    })
  }, Math.random()*1000*40) // 40 seconds seems to work consistently well
}

function scrapeCoursePage(html, url) {
  
  const $ = cheerio.load(html)
  
  let course = {}
  const title = $('#main > h1').text().trim().split(' ')
  course.title = title.slice(2).join(' ')
  course.subj = title[0]
  course.num = title[1]
  course.url = url
  course.desc = $('#main > div.desc > p').text().trim()
  course.instructor = $('#instructor').text()
                    .replace('Instructor','').trim()
  course.offered = $('#offered').text().replace('Offered','').trim()
  // "other" is a bit tricky, and most likely to fail
  // this gets info like prereqs, cross listed courses, etc.
  const other = $('#main').clone().children('h1, div')
                    .remove().end().text().trim().split('\n')
  let attrib = undefined
  // TODO make the distribs/WC separate (match regex or something)
  for (let i = 0; i < other.length; i++) {
    if (attrib === undefined) {
      attrib = other[i].trim() // set next attribute type
    } else {
      course[courseAttribs[attrib] || attrib] = other[i] // set next attribute
      attrib = undefined
    }
  }
  
  return course
}
function writeCourses(courses) {
  console.log('Writing the data')
  fs.writeFile('data/orc_courses.json', JSON.stringify(courses), (err) => {
    console.error(err)
  })
}
