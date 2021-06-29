
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const chatBox= document.querySelector('.chat-box');

// const roomName = document.getElementById('room-name');
const roomName = document.querySelector('.room-name');
// const userList = document.getElementById('users');
const userList = document.querySelector('.participants');

const leaveRoom = document.querySelector('.leave-room');

const enterForm = document.getElementById('enter-form');

const container1 = document.getElementById('container1');
const container2 = document.getElementById('container2');

// get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

showEnterForm();


// console.log({ username, room } );


const socket = io();


// join chatroom
// socket.emit('joinRoom', {username, room});

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });



// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down
    chatBox.scrollTop = chatBox.scrollHeight;

});


enterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const room = e.target.elements.roomid.value;
    console.log(username, room)
    // join chatroom
    socket.emit('joinRoom', {username, room});
    
    showChatBox();
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get message text
    const msg = e.target.elements.msg.value;

    // emit message to server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


//leave room click
leaveRoom.addEventListener('click', (e) => {
    console.log('clicked');
    socket.disconnect();
    socket.connect();
    showEnterForm();
})


//output messge to dom
function outputMessage(message) {
    if(message.username=='bot'){
        const htmlMsg = createBotMessage(message);
        chatBox.insertAdjacentHTML('beforeend', htmlMsg);

    }else{
        if(message.id == socket.id){
            const htmlMsg = createSendChatMessage(message);
            chatBox.insertAdjacentHTML('beforeend', htmlMsg);
        }else{
            const htmlMsg2 = createReceiveChatMessage(message);
            chatBox.insertAdjacentHTML('beforeend', htmlMsg2);
        }
        
    }
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.classList.add("list-group-item");
      if(user.id == socket.id) li.innerText = user.username + " (You)";
      else li.innerText = user.username;
      userList.appendChild(li);
    });
}

function createBotMessage(message){
    const html = 
    `<div class="text-center">
        <span class="badge rounded-pill bg-secondary">${message.text}</span>
    </div>`;
    return html;
}

function createSendChatMessage(message){
    const html = 
    `<div class="text-end chat right-chat"> 
        <span class="username">You</span> 
        <span class="time">${message.time}</span> <br>
        <span class="message">${message.text}</span>
    </div>`;
    return html;
}

function createReceiveChatMessage(message){
    const html = 
    `<div class="text-start chat left-chat"> 
        <span class="username">${message.username}</span> 
        <span class="time">${message.time}</span> <br>
        <span class="message">${message.text}</span>
    </div>`;
    return html;
}
  
function emptyChatMessage(){
    chatBox.innerHTML = "";
}

function showEnterForm(){
    emptyChatMessage();
    container1.classList.remove('hide');
    container2.classList.add('hide'); 
}

function showChatBox(){
    emptyChatMessage();
    container1.classList.add('hide');
    container2.classList.remove('hide');
    document.getElementById('msg').focus();
}
    