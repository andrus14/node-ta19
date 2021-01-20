const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
    console.log(socket.id, 'a user connected');
    io.emit('connection', socket.id);
    socket.on('chat_message', (msg) => {
        io.emit('chat_message', msg);
    });
});



http.listen(3000, () => {
  console.log('listening on *:3000');
});

