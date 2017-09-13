'use strict'

console.log('suh')

window.chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.greeting === 'hello') {
      sendResponse({farewell: 'goodbye'})
    }

    console.log('hit')
  })
