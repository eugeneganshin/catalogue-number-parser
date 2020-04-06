// const { getHTML, parseLinks, getData } = require('./lib/parsers') // If you want to parse the pages and not just snippets.

const axios = require('axios')
const fs = require('fs-extra')

const regFor7 = /\d{7,7}/
const regFor8 = /\d{8,8}/
const regFor3to4 = /(\d{3,3})-(\d{3,4})/
const regFor3to2to5 = /(\d{3,3})-(\d{2,2})-(\d{5,5})/

const wStream = fs.createWriteStream('./textFiles/chunk.txt')

const urls = []
const snippets = []

const returnRegex = (num) => {
  if (regFor7.test(num.toString()) && num.toString().length === 7) {
    main(num, /\d{7,7}/g)
  } else if (regFor8.test(num.toString()) && num.toString().length === 8) {
    main(num, /\d{8,8}/g)
  } else if (regFor3to4.test(num.toString()) && num.toString().length === 8) {
    main(num, /(\d{3,3})-(\d{3,4})/g)
  } else if (regFor3to2to5.test(num.toString()) && num.toString().length === 12) {
    main(num, /(\d{3,3})-(\d{2,2})-(\d{5,5})/g)
  } else {
    return 'NVY' // Not valid yet. Add your RegExr to else if if you want.
  }
}

const main = async (query, reg) => {
  if (query === 'NVY') return
  const params = {
    access_key: '2d9495868544d9630e0c29af27670357',
    query: query,
    auto_location: '1',
    gl: 'ru', // change country if needed
    hl: 'ru', // change language if needed
    num: '100' // amount of search results
  }
  const res = await axios.get('http://api.serpstack.com/search', { params })
  const data = await res.data

  data.organic_results.map((result, number) => urls.push(result.url))
  data.organic_results.map((result, number) => snippets.push(`${number + 1}. ${result.snippet}`))

  await wStream.write(snippets.toString(), (err) => err ? console.error(err) : console.log('File saved'))

  const readStream = fs.createReadStream('./textFiles/chunk.txt')
  let chunkOfData = ''
  readStream.on('data', chunk => {
    chunkOfData += chunk.toString()
  })
  readStream.on('end', () => {
    const matches = new Set(chunkOfData.match(reg))
    console.log(matches)
    return matches
  })
}

returnRegex('4653041') // Use string (just in case)
