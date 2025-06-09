document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const usernameInput = document.getElementById('username');
    const roomSelect = document.getElementById('roomSelect');
    const joinBtn = document.getElementById('joinBtn');
    const chatBox = document.getElementById('chatBox');
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    let currentRoom = '';
    let currentUsername = '';

    joinBtn.addEventListener('click', () => {
        currentUsername = usernameInput.value.trim();
        currentRoom = roomSelect.value;
        
        if (currentUsername && currentRoom) {
            socket.emit('joinRoom', {
                username: currentUsername,
                room: currentRoom
            });
            
            chatBox.style.display = 'block';
            messageInput.disabled = false;
            sendBtn.disabled = false;
            joinBtn.disabled = true;
        }
    });

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('sendMessage', {
                message,
                username: currentUsername,
                room: currentRoom
            });
            messageInput.value = '';
        }
    }

    socket.on('message', (data) => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <span class="user">${data.username}:</span>
            <span>${data.text}</span>
        `;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
});