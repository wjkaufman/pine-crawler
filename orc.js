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
let coursesErr = 0

for (let i = 0; i < courseURLs.length; i++) {
  let url = courseURLs[i]
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
      console.log(`coursesRecieved: ${coursesRecieved} (/${coursesRecieved + coursesErr})`)
      // if (coursesRecieved >= 2000) {
      //   console.log(courses)
      // }
      
      // some sort of mongodb magic here...
      
    })
  }, Math.random()*1000*40)
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
  // "other" is a bit tricky, and most likely to fail
  // this gets info like prereqs, cross listed courses, etc.
  const other = $('#main').clone().children('h1, div')
                    .remove().end().text().trim().split('\n')
  let attrib = undefined
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

/*
  Synchronous method to scrape course data
*/

// function requestSync(urls, i) {
//   request(urls[i], (err, res, html) => {
//     if (err) {
//       return console.error(err + ` (${url})`)
//     }
//     const $ = cheerio.load(html)
//     
//     let title = $('h1').text().trim()
//     // other stuff I can pull from this page
//     let course = {title}
//     courses.push(course)
//     coursesRecieved ++
//     console.log(`coursesRecieved: ${coursesRecieved} (/${coursesRecieved + coursesErr})`)
//     if (i < urls.length) {
//       requestSync(urls, i+1)
//     }
//   })
// }
// 
// console.log('Doing the thing');
// 
// requestSync(courseURLs, 0)

console.log('Done starting all requests')
