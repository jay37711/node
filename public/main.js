const myUrl2 = window.location.href;
const urlParams = new URL(myUrl2).searchParams;
const password = urlParams.get('password');
const name = urlParams.get('username');
const socket = io()
const clientsTotal = document.getElementById('client-total')
const username = document.getElementById('name-input')
const userList = document.getElementById('user-list')



window.addEventListener('load', function() {
  if(password === '' || name === ''){
    window.location.href = 'index.html';
  }else{
    username.value = name;
    const senddata = {
      name : name,
      password : password ,
      dateTime: new Date()
    }
    socket.emit('authentication', senddata)
  }
});

socket.on('client-total', (data) => {
    clientsTotal.innerText = `Total User: ${data}`
});
socket.on('user-details', (data) => {
    console.log(data)
    var element = '';
    data.forEach(function (user) {
      element += `
        <li class="user-list-custom">
            <p class="message">
              ${user.name}
              <span>${moment(user.dateTime).fromNow()}</span>
            </p>
          </li>
          `
    });
    userList.innerHTML = element

});

const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

function sendMessage() {
    if (messageInput.value === '') return

      console.log(messageInput.value)
      const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
      }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message', (data) => {
    messageTone.play()
    addMessageToUI(false, data)
  })

  function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
              ${data.message}
              <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
            </p>
          </li>
          `
  
    messageContainer.innerHTML += element
    scrollToBottom()

  }

  function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
  }

  messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  
  messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })

  socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element
  })
  
  function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }

//   socket.on('disconnect', function() {
//     window.location.href = 'index.html';
// });
  