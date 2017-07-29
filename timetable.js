import request from 'request'
import cheerio from 'cheerio'
import fs from 'fs'

const timetableInfo = [
    'term', 'CRN', 'subj', 'num', 'sec', 'title', 'text', 'xlist', 'period', 'room', 'building', 'instructor', 'WC', 'dist', 'lim', 'enrl', 'status', 'lrn-obj'
]

export function saveTimetableInfo() {
	const url = 'http://oracle-www.dartmouth.edu/dart/groucho/timetable.display_courses?distribradio=alldistribs&depts=no_value&periods=no_value&distribs=no_value&distribs_i=no_value&distribs_wc=no_value&pmode=public&term=&levl=&fys=n&wrt=n&pe=n&review=n&crnl=no_value&classyear=2008&searchtype=Subject+Area%28s%29&termradio=allterms&terms=no_value&subjectradio=allsubjects&hoursradio=allhours&sortorder=dept'

	const url2 = 'http://oracle-www.dartmouth.edu/dart/groucho/timetable.display_courses?distribradio=alldistribs&depts=no_value&periods=no_value&distribs=no_value&distribs_i=no_value&distribs_wc=no_value&pmode=public&term=&levl=&fys=n&wrt=n&pe=n&review=n&crnl=no_value&classyear=2008&searchtype=Subject+Area%28s%29&termradio=selectterms&terms=no_value&terms=201709&subjectradio=selectsubjects&depts=ENGS&hoursradio=allhours&sortorder=dept'

	request(url2, (err, res, html) => {
		if (err) {
			return console.error(err)
		}
		const $ = cheerio.load(html)

		let courses = []

		$('div.data-table table tbody tr').each(function(i, elem) {
			//   console.log(`i is ${i}`)
			let course = {}
			// for each tr, which is one course
			$(this).children('td').each(function(j, elem2) {
				// get td elements
				if ($(this).text().trim().length > 0) {
					course[timetableInfo[j]] = $(this).text().trim()
				}
			})

			courses[i] = course
		})
		// console.log(courses)
		fs.writeFile('courses_timetable.json', JSON.stringify(courses), (err) => {
			console.log('file written successfully')
		})
	})
}
