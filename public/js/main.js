//chat form where the user inputs message to send
const chatForm = document.getElementById('chat-form');
const socket = io();

//this will be catched whenever the server sends any message
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    //we are getting the element with ID msg (which is the content of the form)
    const message = e.target.elements.msg.value;

    //send message to server
    socket.emit('chatMessage', message);
});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
      ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}