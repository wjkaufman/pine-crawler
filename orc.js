import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

const courseLinks = JSON.parse(fs.readFileSync('data/orc_course_links.json', 'utf8'))

console.log(`Loaded ${courseLinks.length} course links`)

let courses = []
let coursesRecieved = 0
let coursesErr = 0

// for (let i = 0; i < courseLinks.length; i++) {
//   let link = courseLinks[i]
//   request(link, (err, res, html) => {
//     if (err) {
//       coursesErr ++
//       return console.error(err + ` (${link})`)
//     }
//     const $ = cheerio.load(html)
//     
//     let title = $('h1').text()
//     // other stuff I can pull from this page
//     let course = {title}
//     courses.push(course)
//     coursesRecieved ++
//     console.log(`coursesRecieved: ${coursesRecieved} (/${coursesRecieved + coursesErr})`)
//     if (coursesRecieved >= 2000) {
//       console.log(courses)
//     }
//     
//     // some sort of mongodb magic here...
//     
//   })
// }

/*
  Synchronous method to scrape course data
*/

function requestSync(links, i) {
  request(links[i], (err, res, html) => {
    if (err) {
      return console.error(err + ` (${link})`)
    }
    const $ = cheerio.load(html)
    
    let title = $('h1').text().trim()
    // other stuff I can pull from this page
    let course = {title}
    courses.push(course)
    coursesRecieved ++
    console.log(`coursesRecieved: ${coursesRecieved} (/${coursesRecieved + coursesErr})`)
    if (i < links.length) {
      requestSync(links, i+1)
    }
  })
}

console.log('Doing the thing');

requestSync(courseLinks, 0)

console.log('Done starting all requests')
