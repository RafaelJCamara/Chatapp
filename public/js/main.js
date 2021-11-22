//chat form where the user inputs message to send
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chatroom
socket.emit('joinRoom', { username, room });

//this will be catched whenever the server sends any message
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    //focus on the last message sent
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //we are getting the element with ID msg (which is the content of the form)
    const message = e.target.elements.msg.value;

    //send message to server
    socket.emit('chatMessage', message);

    //clear message input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}