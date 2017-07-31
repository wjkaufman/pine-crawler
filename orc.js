import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

const courseLinks = JSON.parse(fs.readFileSync('data/orc_course_links.json', 'utf8'))

console.log(`Loaded ${courseLinks.length} course links`)

let courses = []

for (let i = 0; i < courseLinks.length; i++) {
  let link = courseLinks[i]
  request(link, (err, res, html) => {
    if (err) {
      return console.error(err + ` (${link})`)
    }
    const $ = cheerio.load(html)
    
    let title = $('h1').text()
    // other stuff I can pull from this page
    
    // some sort of mongodb magic here...
    
  })
}
