const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));


const rooms = {};

io.on('connection', socket => {
    console.log('Novo usuário conectado');
    
    socket.on('joinRoom', ({ username, room }) => {

        socket.join(room);
        

        if (!rooms[room]) rooms[room] = [];
        rooms[room].push({ id: socket.id, username });
 
        socket.to(room).emit('message', {
            username: 'Sistema',
            text: `${username} entrou na sala ${room}`
        });
        

        socket.emit('message', {
            username: 'Sistema',
            text: `Bem-vindo à sala ${room}, ${username}!`
        });
    });

    socket.on('sendMessage', ({ message, username, room }) => {
        io.to(room).emit('message', { username, text: message });
    });

    socket.on('disconnect', () => {
        // Limpeza ao desconectar
        Object.keys(rooms).forEach(room => {
            rooms[room] = rooms[room].filter(user => user.id !== socket.id);
        });
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));