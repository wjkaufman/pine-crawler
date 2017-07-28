var babel = require('babel-core')
import express from 'express'
import fs from 'fs'
import request from 'request'
import cheerio from 'cheerio'

const app = express()

app.get('/', (req, res) => {
  console.log('got a request')
  res.send('Hello, world!')
  let url = 'http://oracle-www.dartmouth.edu/dart/groucho/timetable.display_courses' +
  '?distribradio=alldistribs&depts=no_value&periods=no_value' +
  '&distribs=no_value&distribs_i=no_value&distribs_wc=no_value' +
  '&pmode=public&term=&levl=&fys=n&wrt=n&pe=n&review=n&crnl=no_value' +
  '&classyear=2008&searchtype=Subject+Area%28s%29&termradio=allterms' +
  '&terms=no_value&subjectradio=allsubjects&hoursradio=allhours&sortorder=dept'
  
  let url2 = 'http://oracle-www.dartmouth.edu/dart/groucho/timetable.display_courses?distribradio=alldistribs&depts=no_value&periods=no_value&distribs=no_value&distribs_i=no_value&distribs_wc=no_value&pmode=public&term=&levl=&fys=n&wrt=n&pe=n&review=n&crnl=no_value&classyear=2008&searchtype=Subject+Area%28s%29&termradio=selectterms&terms=no_value&terms=201709&subjectradio=selectsubjects&depts=ENGS&hoursradio=allhours&sortorder=dept'
  
  request(url2, (err, res, html) => {
    if (err) {
      return console.error(err)
    }
    console.log('No error!')
    var $ = cheerio.load(html)
    let data = $('div.data-table table tbody tr')
    
    // for (let i = 0; i < data.length; i++) {
    //   console.log('blah')
    //   // console.log(data[i].children[0])
    // }
  })
})

app.listen(8080, () => {
  console.log('App is listening on port 8080')
})
