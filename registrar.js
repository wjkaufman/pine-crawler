import request from 'request'
import cheerio from 'cheerio'
import fs from 'fs'

const hostname = 'http://dartmouth.smartcatalogiq.com/'

const courseAttribs = {
  'Prerequisite': 'prereq',
  'Distributive and/or World Culture': 'dist'
}

// get all information from all departments on registrar's website
export function getAll() {
	const url = 'http://dartmouth.smartcatalogiq.com/en/current/orc/Departments-Programs-Undergraduate'

	request(url, (err, res, html) => {
		if (err) {
			return console.error(err)
		}

		const $ = cheerio.load(html)

		$('div#sc-programlinks li p a').each(function(i, elem) {
			console.log(`dept #${i}`)
			const url = $(this).attr('href')
      const deptURL = sanitizeURL(url, hostname)
			console.log(`deptURL: ${deptURL}`)
      if (deptURL.indexOf('Phys') >= 0) {
        getCourseListURL(deptURL)
      }
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
		$('#sc-programlinks > ul > li > p > a').each(function(i, elem) {
			const url = $(this).attr('href')
			if (url !== undefined) {
				const courseListURL = sanitizeURL(url, hostname)
				console.log(`courseListURL: ${courseListURL}`)
				getCourseURL(courseListURL)
			} else {
				console.log('Couldn\'t find course page url!')
			}
		})

	})
}

/*
  Get url for specific course from a course list page
*/
function getCourseURL(courseListURL) {
	request(courseListURL, (err, res, html) => {
		if (err) {
			return console.error(err)
		}
		const $ = cheerio.load(html)
    $('#main > ul > li > a').each(function(i, elem) {
      const url = $(this).attr('href')
      if (url !== undefined) {
        const courseURL = sanitizeURL(url, hostname)
        console.log(`courseURL: ${courseURL}`)
        getCourseInfo(courseURL)
      }
    })
	})
}

function getCourseInfo(courseURL) {
  request(courseURL, (err, res, html) => {
    if (err) {
      return console.error(err)
    }
    const $ = cheerio.load(html)
    let course = {}
    const title = $('#main > h1').text().trim().split(' ')
    course.title = title.slice(2).join(' ')
    course.subj = title[0]
    course.num = title[1]
    course.url = courseURL
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
        course[courseAttribs[attrib]] = other[i] // set next attribute
        attrib = undefined
      }
    }
    course.offered = $('#offered').text().replace('Offered','')
    console.log('course is:')
    console.log(course)
    // magic of parsing through stuff should happen here
    
  })
}


/*
  checks that urls have hostname in front, puts it there otherwise
*/
function sanitizeURL(url, hostname) {
	return url[0] === '/' ? hostname + url.substring(1) : url
}
