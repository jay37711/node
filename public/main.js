// const myUrl2 = window.location.href;
// const urlParams = new URL(myUrl2).searchParams;
const password = localStorage.getItem('password');
const name = localStorage.getItem('username');
const roomName = localStorage.getItem('roomname');
const socket = io()
const clientsTotal = document.getElementById('client-total')
const room = document.getElementById('room-name')
const username = document.getElementById('name-input')
const userList = document.getElementById('user-list')



window.addEventListener('load', function() {
  if(localStorage.getItem('username') == null){
    window.location.href = 'index.html';
  }
  if(roomName === '' || name === ''){
    window.location.href = 'index.html';
  }else{
    username.value = name;
    const senddata = {
      name : name,
      password : password ,
      dateTime: new Date(),
      roomName : roomName,
    }
    socket.emit('authentication', senddata)
  }
});

socket.on('roomUsers', (data) => {
    clientsTotal.innerText = `Total User: ${data.users.length}`
    room.innerText = `Room Name: ${data.room}`
    console.log(data)
    var element = '';
    data.users.forEach(function (user) {
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
    // addMessageToUI(true, data)
    messageInput.value = ''
}

  socket.on('chat-message', (data) => {
    if(data.username != name){
      messageTone.play()
    }
    addMessageToUI(data.username == name ? true : false, data)
  })

  function addMessageToUI(isOwnMessage, data) {
    console.log(data)
    clearFeedback();
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
              ${data.text.message}
              <span>${data.username == name ? 'you' : data.username} ● ${data.time}</span>
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
      feedback: nameInput.value,
    })
  })
  
  messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
      feedback: nameInput.value,
    })
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })

  socket.on('feedback', (data) => {
    clearFeedback()
    if(data.feedback != name){
      if(data.feedback){
        const element = `
                <li class="message-feedback">
                  <p class="feedback" id="feedback">${data.feedback} is typing.....</p>
                </li>
          `
          messageContainer.innerHTML += element
      }
    }
  })
  
  function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }


 // Function to show modal
 function showModal() {
  document.getElementById("myModal").style.display = "block";
}

// Function to close modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
function leaveRoom() {
  // Disconnect the socket
  socket.disconnect();
  localStorage.removeItem('username');
  localStorage.removeItem('roomname');

  // Redirect to index.html
  window.location.href = "index.html";
}
