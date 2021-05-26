// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const Room = require('./models/Rooms');
const Chat = require('./models/Chats')

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = config.get('mongoURI');

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint
app.post("/create", function(req, res){
    const newRoom = new Room({
        name: req.body.roomName
    })
    newRoom.save().then(console.log("room added"))
    .catch(e => console.log(e))
})

app.get("/getRoom", function(req, res){
    Room.find().lean().then(items => {
        res.json(items)
    })
})
app.get('/pullMessages', function(req, res) {
    Chat.find().lean().then(items => {
        res.json(items)
    })
});

app.post('/sendChat', function(req, res) {
    var newDate = new Date();
    var date = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
    var time = newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
    var dateTime = date+' '+time;
    const newChat = new Chat({
        message: req.body.chatMessage,
        timestamp: dateTime,
        room: req.body.roomName,
        user: req.body.username,
    })
    newChat.save().then(console.log("chat stored"))
    .catch(e => console.log(e))
})
app.get('/', homeHandler.getHome);
app.get('/:roomName', roomHandler.getRoom);

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));