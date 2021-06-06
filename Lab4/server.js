// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const Room = require('./models/Rooms');
const Chat = require('./models/Chats')
const passport = require('passport');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');

const app = express();
const port = 8080;

const roomGenerator = require('./util/roomIdGenerator.js');


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

// Passport setup for oauth
passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "154642560850-im7bba8s5nvso1hgkqofebehc9scuerc.apps.googleusercontent.com",
    clientSecret: "I2bEe1oI418tF15UAELg-S-1",
    callbackURL: "http://localhost:8080/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */
    return done(null, profile);
  }
));

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
// app.get('/', (req, res) => res.send('Example Home page!'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
// app.get('/home', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint
app.post("/create", function(req, res){
    const newRoom = new Room({
        name: req.body.roomName,
        identifier: roomGenerator.roomIdGenerator()
    })
    newRoom.save().then(console.log("room added"))
    .catch(e => console.log(e))
})
app.get("/getroom", function(req, res){
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
    // console.log("send button received")
    // console.log(req.body.chatMessage)
    var newDate = new Date();
    var date = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
    var time = newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
    var dateTime = date+' '+time;
    const newChat = new Chat({
        message: req.body.chatMessage,
        timestamp: dateTime,
        room: req.body.id,
        user: req.body.username,
    })
    newChat.save().then(console.log("chat stored"))
    .catch(e => console.log(e))
})
app.get('/home', homeHandler.getHome);
app.get('/:id/:roomName', roomHandler.getRoom);



// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));