const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// const ejsLint = require('ejs-lint');
const app=express();

//passport config
require('./config/passport')(passport);

//db config for
const db = require('./config/keys.js').MongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser:true})
.then(()=>{console.log('mongoDB connection successful')})
.catch(err => console.log(err));


//EJS
var path = require('path');
app.use(expressLayouts);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//bodyparser
app.use(express.urlencoded({extended: false}));

//express sessiom middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));
//connect flash
app.use(flash());

//global Vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());



//set routes
app.use('/',require('./routes/index'));

//access login and register  page with this routes
app.use('/users',require('./routes/users'))
const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));

