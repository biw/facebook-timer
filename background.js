
console.log('refreshed background')

let state = {
  currentTime: 0,
  maxTime: -1,
  timeout: 0
}

setInterval(() => {
  sendMessageToFbTabs()
  if (state.maxTime !== -1 && state.timeout > 0) {
    console.log(state.timeout, state.currentTime, state.maxTime)
    state.timeout -= 1000
    state.currentTime += 1000

    if (state.currentTime >= state.maxTime) {
      state.maxTime = -1
      console.error('ran out of time!!')
      window.chrome.runtime.sendMessage({'message': 'ran out of time'})
    }
  }
}, 1000)

const sendMessageToFbTabs = () => {
  window.chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (tab.url.substr(0, 25) === 'https://www.facebook.com/') {
        window.chrome.tabs.sendMessage(tab.id, {status: 'off'})
      }
    }
  })
}

window.chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'timeUpdate') {
      state.timeout = 5000
    } else if (request.type === 'timeReset') {
      state.currentTime = 0
    } else if (request.type === 'timeSetter') {
      state.maxTime = request.maxTime
    }
  }
)
