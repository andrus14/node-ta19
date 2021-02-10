const express = require('express');
const app = express();

const http = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(http)

const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

var bodyParser = require('body-parser');
const path = require('path');

const port = 8000;

const userList = {};

// config
app.use('/public', express.static('./public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// redis server
const RedisStore = connectRedis(session);

//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

redisClient.on('error', function(err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function(err) {
    console.log('Connected to redis successfully');
});

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 60 * 24 // session max age in miliseconds
    }
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

app.get("/", (req, res) => {
    sess = req.session;
    console.log('sess id:', req.session.id, sess.username, sess.password);

    if (sess.username && sess.password) {
        sess = req.session;
        if (sess.username) {
            res.sendFile(__dirname + '/public/index.html');
        }
    } else {
        res.sendFile(__dirname + "/public/login.html");
    }
});

app.post("/login", (req, res) => {
    console.log(req.body);
    redisClient.hgetall('users', (err, result) => {

        let isSuccess = false;

        if (req.body.username in result) {
            if (result[req.body.username] == req.body.password) {
                isSuccess = true;
            }
        }

        if (isSuccess) {
            sess = req.session;
            sess.username = req.body.username;
            sess.password = req.body.password;
            console.log('login', req.body.username, req.body.password, sess.username, sess.password);
            res.json({response: 'success'});
        } else {
            res.json({response: 'errorWrongCredentials'});
        }
    });
});

app.post("/register", (req, res) => {
    console.log(req.body.username, req.body.password, 'register');

    redisClient.hgetall('users', (err, result) => {
        let isSuccess = false;
        if (result) {
            if (req.body.username in result) {
                isSuccess = false
            }
            isSuccess = true;
        } else {
            isSuccess = true;

        }
        if (isSuccess) {
            redisClient.hset('users', req.body.username, req.body.password);
            res.json({response: 'success'});
        } else {
            res.json({response: 'errorUserExists'});

        }
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect("/")
    });
});

io.on('connection', (socket) => {
    // on connection
    const sess = socket.request.session
    userList[sess.username] = socket.id;
    io.emit('updateUserList', userList);

    socket.on('chat_message', msg => {
        if ( msg.charAt(0) == '/' ) { // we have a command
            const command = msg.split(' ')[0];

            if ( command == '/w' ) {
                const user = msg.split(' ')[1];
                const privateMsg = msg.split(' ').slice(2).join(' ');
                if ( userList[user] != undefined ) {
                    io.to(userList[user]).emit('whisper', {msg: privateMsg, sender: sess.username});
                } else {
                    socket.emit('error_whisper', 'Kasutajat pole olemas');
                }
            }
        } else {
            io.emit('chat_message', { 'message': msg, 'socketId': socket.id, 'user': sess.username });
        }
    });

    socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected');
        delete userList[sess.username];
        io.emit('updateUserList', userList);
    });
});

http.listen(port, () => {
    console.log('listening on *:' + port);
});