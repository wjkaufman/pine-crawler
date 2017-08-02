/*
  Going to try to follow Alex Beal's method of getting all classes:
  expand all links in the nav, then parse course data that way
  
  using casper.js (I think this doesn't support ES6 yet)
  
  Using parts of Alex Beal's scraper code: https://github.com/dado3212/classy
*/
var casperjs = require('casper')
var fs = require('fs')

var casper = casperjs.create()

var baseURL = 'http://dartmouth.smartcatalogiq.com'
var courseLinks
var courses

casper.start('http://dartmouth.smartcatalogiq.com/current/orc.aspx')

casper.then(function() {
  this.echo('Starting the orc scraper')
})

function expand(casper) {
  casper.echo('expanding...')
  casper.evaluate(function() {
    $('span.expandable:not(.collapsible)').click()
  })
  casper.wait(1000, function() {
    if (this.exists('span.expandable:not(.collapsible)')) {
      expand(casper)
    } else {
      this.echo('Finished expanding')
    }
  })
}

casper.then(function() {
  expand(this)
})

// everything is now expanded, time to get course page URLs

casper.then(function() {
  var courseNameRegex = /([A-Za-z]{3,4}) ([0-9\.]+)/
  var courseElements = this.getElementsInfo('a').filter(function(el) {
    return (courseNameRegex.exec(el.text) !== null)
  }, this)
  courseLinks = courseElements.map(function(el) {
    return (baseURL + el.attributes.href)
  })
  fs.write('data/orc_course_links.json', JSON.stringify(courseLinks), 'w')
})

casper.run()
