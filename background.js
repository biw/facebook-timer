'use strict'

// let div = document.createElement('div')

// let overlay = `
// <div class="fbbr__overlay">
//   <div class="container">
//     <h1 class="title">How long do you want to be on Facebook for?</h1>
//     <div class="button_selection button_selection__one">1<span class="minute">minute</span></div>
//     <div class="button_selection button_selection__two">2<span class="minute">minutes</span></div>
//     <div class="button_selection button_selection__five">5<span class="minute">minutes</span></div>
//     <div class="button_selection button_selection__infinity"> &#x221e;<span class="minute">minutes</span></div>
//   </div>
// </div>
// `

// div.innerHTML = overlay

// document.body.appendChild(div)


document.getElementById('infinity_button').onmouseover = () => {
  console.log('1')
  document.getElementById('boo_hover').className = 'boo_hover ease_up'
}

document.getElementById('infinity_button').onmouseout = () => {
  console.log('2')
  document.getElementById('boo_hover').className = 'boo_hover ease_out'
}
