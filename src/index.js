import which from 'which'

function createResult({found = false, path} = {}) {
  return {found, path}
}

function failedResult() {
  return createResult({found: false})
}

function goodResult(browserPath) {
  return createResult(
    {
      found: true,
      path: browserPath
    }
  )
}

function findBrowsers(...browsers) {
  let promises = browsers.map((browserName) => new Promise((resolve, reject) => {
    which(browserName, (err, path) => {
      if (err) {
        resolve(failedResult())
      }

      resolve(goodResult(path))
    })
  }))

  let promiseFinalForm = Promise.all(promises)

  return promiseFinalForm
}

function firstBrowser(...browsers) {
  let promise = findBrowsers.apply(null, browsers)

  return promise.then((results) => results.filter((result) => result.found))
    .then((results) => {
      if (results.length > 0) {
        return results[0]
      } else {
        throw new Error('No browsers found')
      }
    })
}

export {
  firstBrowser as first,
  findBrowsers as find
}

export default findBrowsers
