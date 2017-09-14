'use strict'

let state = {
  currentTime: 0,
  maxTime: -1,
  timeout: 0,
  infinitySent: false
}

setInterval(() => {
  if (state.maxTime !== -1 && state.timeout > 0 && state.infinitySent === false) {
    if (state.maxTime !== 'Infinity') {
      state.timeout -= 1000
      state.currentTime += 1000
    } else {
      state.infinitySent = true
    }

    let niceTime = generateNiceTime(state.currentTime, state.maxTime)
    sendMessageToFbTabs({status: 'timeUpdate', time: niceTime})

    if (state.currentTime >= state.maxTime) {
      state.maxTime = -1
      sendMessageToFbTabs({status: 'on'})
      window.chrome.storage.local.set({status: 'on'})
    }
  }
}, 1000)

const generateNiceTime = (currentMilli, maxMilli) => {
  if (maxMilli === 'Infinity') {
    return 'Infinity'
  }

  let rawTime = maxMilli - currentMilli
  let minutes = Math.floor(rawTime / 60000)
  let seconds = ('0' + ((rawTime % 60000) / 1000).toFixed(0)).slice(-2)

  return `${minutes}:${seconds}`
}

const sendMessageToFbTabs = (message) => {
  window.chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (tab.url.substr(0, 25) === 'https://www.facebook.com/') {
        window.chrome.tabs.sendMessage(tab.id, message)
      }
    }
  })
}

window.chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'timeUpdate') {
      state.timeout = 5000
    } else if (request.type === 'timeReset') {
      window.chrome.storage.local.set({status: 'off'})
      sendMessageToFbTabs({status: 'off'})
      state.currentTime = 0
    } else if (request.type === 'timeSetter') {
      state.maxTime = request.maxTime

      if (state.maxTime !== 'Infinity') {
        state.infinitySent = false
      }
    }
  }
)
