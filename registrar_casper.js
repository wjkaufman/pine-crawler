/*
  Going to try to follow Alex Beal's method of getting all classes:
  expand all links in the nav, then parse course data that way
  
  using casper.js
*/
const casper = require('casper').create({
  // verbose: true,
  // logLevel: 'debug'
})

var baseURL = 'http://dartmouth.smartcatalogiq.com'

casper.start('http://dartmouth.smartcatalogiq.com/current/orc.aspx')

casper.then(function() {
  this.echo('Starting the orc scraper')
})

function expand(casper) {
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
    return (courseNameRegex.exec(el.text) !== null && el.text.indexOf('PHYS') >= 0)
  }, this)
  var courseLinks = courseElements.map(function(el) {
    return (baseURL + el.attributes.href)
  })
  this.echo(JSON.stringify(courseLinks))
})

// TODO async loop through course URLs, pull info, and save

casper.run()
