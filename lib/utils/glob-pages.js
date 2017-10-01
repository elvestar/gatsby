/* @flow weak */
import glob from 'glob'
import buildPage from './build-page'
import pageFileTypes from './page-file-types'

const debug = require('debug')('gatsby:glob')

function globQuery (directory) {
  const fileGlobQuery = pageFileTypes.map(type => `*.${type}`)
  const joinedFileQuery = fileGlobQuery.join('|')
  return `${directory}/content/**/?(${joinedFileQuery})`
}

let globCache
function createCache (directory, callback) {
  const pagesData = []

  glob(globQuery(directory), { follow: true }, (err, pages) => {
    if (err) { return callback(err) }

    pages.forEach((page) => {
      if (!page.includes('/content/time/')) {
        pagesData.push(buildPage(directory, page))
      }
    })

    debug(`globbed ${pagesData.length} pages`)
    globCache = pagesData
    return callback(null, pagesData)
  })
}

module.exports = function globPages (directory, callback) {
  if (typeof globCache === 'undefined') {
    createCache(directory, callback)
  } else {
    callback(null, globCache)
  }
}
