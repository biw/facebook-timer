
const createOverlay = (timesUp = false) => {
  let overlay = document.createElement('div')
  overlay.className = 'fbbr__overlay'
  overlay.id = 'fbbr__overlay'

  let timesUpDiv = ''
  let titleText = 'How long do you want to be on Facebook for?'
  if (timesUp === true) {
    timesUpDiv = `
    <div id="timesUp">
      <h1 class="title title__times_up">🚨 Times Up 🚨</h1>
      <p>You should probably get off Facebook and do something useful. If not...</p>
    </div>
    `
    titleText = 'How much longer do you want to be on Facebook for?'
  }

  let overlayHTML = `
  <div class="container">
    ${timesUpDiv}
    <h1 class="title">${titleText}</h1>
    <div class="button_selection button_selection__one" timeLimit=1>1<span class="minute">minute</span></div>
    <div class="button_selection button_selection__two" timeLimit=2>2<span class="minute">minutes</span></div>
    <div class="button_selection button_selection__five" timeLimit=5>5<span class="minute">minutes</span></div>
    <div id="infinity_button" class="button_selection button_selection__infinity" timeLimit=infinity> &#x221e;<span class="minute">minutes</span></div>
    <div class="boo_hover_container">
      <div id="boo_hover" class="boo_hover">
        <div class="boo_hover_arrow"></div>
        <img class="boo_hover_image" src="https://i.imgur.com/TkYVQWK.png" alt="BOO! NOT COOL!">
      </div>
    </div>
  </div>
  `
  overlay.innerHTML = overlayHTML
  document.body.appendChild(overlay)
}

const deleteOverlay = () => {
  document.body.removeChild(document.getElementById('fbbr__overlay'))
}

const setTimer = (time) => {
  let miliTime = parseInt(time) * 1000 * 60
  if (isNaN(miliTime) === true) {
    miliTime = 'Infinity'
  }
  window.chrome.runtime.sendMessage({type: 'timeSetter', maxTime: miliTime})
}

const initFBBlock = (timesUp = false) => {
  createOverlay(timesUp)

  document.getElementById('infinity_button').onmouseover = () => {
    document.getElementById('boo_hover').className = 'boo_hover ease_up'
  }

  document.getElementById('infinity_button').onmouseout = () => {
    document.getElementById('boo_hover').className = 'boo_hover ease_out'
  }

  let buttonList = document.getElementsByClassName('button_selection')
  for (let button of buttonList) {
    button.onclick = () => {
      let timeLimit = button.getAttribute('timeLimit')
      window.chrome.runtime.sendMessage({type: 'timeReset'})
      setTimer(timeLimit)
    }
  }
}

var id = Math.random().toString(36).substr(2, 5)
setInterval(() => {
  window.chrome.runtime.sendMessage({type: 'timeUpdate', id})
}, 1000)

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.status === 'on') {
    initFBBlock(true)
  } else if (request.status === 'off') {
    deleteOverlay()
  } else if (request.status === 'timeUpdate') {
    editTimerTime(request.time)
  }
})

window.chrome.storage.local.get('status', (item) => {
  if (item.status === 'on' || item.status === undefined) {
    initFBBlock()
  }
})

const createTimer = () => {
  let navBar = document.querySelectorAll('[role="navigation"]')[0]

  let timerHTML = '<div class="fbbr_timer" id="fbbr_timer"><span class="fbbr_time" id="fbbr_time">0:00</span><span class="fbbr_setting">settings</span></div>'

  navBar.innerHTML = timerHTML + navBar.innerHTML

  document.getElementById('fbbr_timer').onclick = () => {
    initFBBlock()
  }
}
createTimer()

const editTimerTime = (newTime) => {
  let timer = document.getElementById('fbbr_time')

  if (newTime === 'Infinity') {
    newTime = '<div class="ffbr_timer_infinity">&#8734;</div>'
  }

  timer.innerHTML = newTime
}
