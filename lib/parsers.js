const fetch = require('node-fetch')
const sanitizeHtml = require('sanitize-html')
const Promise = require('bluebird')
const { JSDOM } = require('jsdom')

const getHTML = async url => {
  try {
    const res = await fetch(url)
    const data = await res.text()
    return data
  } catch (error) {
    console.error(error)
  }
}

const parseLinks = async url => {
  const res = await fetch(url)
  const data = await res.text()
  const dom = new JSDOM(data)
  const divs = Array.from(dom.window.document.querySelectorAll('div'), el => el.textContent)
  const clean = sanitizeHtml(divs)
  return clean
}

const getData = async urls => {
  const data = await Promise.map(urls, url => parseLinks(url))
  return data
}

module.exports = { getHTML, parseLinks, getData }
