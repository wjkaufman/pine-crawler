import request from 'request'
import cheerio from 'cheerio'
import fs from 'fs'

const hostname = 'http://dartmouth.smartcatalogiq.com/'

// get all information from all departments on registrar's website
export function getAll() {
  const url = 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate'
  
  request(url, (err, res, html) => {
    if (err) {
      return console.error(err)
    }
    
    const $ = cheerio.load(html)
    
    $('div#sc-programlinks li p a').each(function(i, elem) {
      console.log(i)
      const deptURL = $(this).attr('href')
      console.log(`deptURL: ${deptURL}`)
      console.log(sanitizeURL(deptURL, hostname))
      getCourseListURL(sanitizeURL(deptURL, hostname))
    })
  })
}

/*
  Get course page URL from the dept URL
  Will then pass it along to course parser
*/
function getCourseListURL(deptURL) {
  request(deptURL, (err, res, html) => {
    if (err) {
      return console.error(err)
    }
    const $ = cheerio.load(html)
    
    console.log(`deptURL (inside func): ${deptURL}`);
    console.log('href attrib of course page link thing:')
    const courseListURL = $('#sc-programlinks > ul > li > p > a').attr('href')
    console.log(`course page: ${courseListURL}`)
    if (courseListURL !== undefined) {
      const url = sanitizeURL(courseListURL, hostname)
      console.log(`course page url: ${url}`)
    } else {
      console.log('Couldn\'t find course page url!')
    }
    
  })
}

// function get

function sanitizeURL(url, hostname) {
  return url[0] === '/' ? hostname + url.substring(1) : url
}
