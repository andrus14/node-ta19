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
    resave: false,
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
    sess = req.session;
    sess.username = req.body.username;
    sess.password = req.body.password;
    // add username and password validation logic here if you want. If user is authenticated send the response as success
    res.end("success");
});

app.post("/register", (req, res) => {
    console.log(req.body.username, req.body.password, 'register');
  

  // if ( on juba kasutajanimi kasutuses) { // siin peab uurima, kuidas redis baasist kontrollida, kas on kasutajnimi juba kasutuses
  //   res.end("userNameInUse");
  // } else {

    // salvesta baasi
    //   res.end("success");
    // }
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
        console.log(msg)
        io.emit('chat_message', { 'message': msg, 'socketId': socket.id, 'user': sess.username });
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
