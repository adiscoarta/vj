const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const {mongoURI} = require('./config/database');

const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport
require('./config/passport')(passport);

//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, {})
.then(()=> console.log('MongoDb Online'))
.catch(err => console.log(err));

//load idea Model


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'handlebars');

//Method override
app.use(methodOverride('_method'));

//session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//flash
app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Globals
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});



// index route
app.get('/', (req, res) => {
    const title = 'Welcome page';
    res.render('index', {
        title: title
    });
});

// about route
app.get('/about', (req, res) => {
    res.render("about");
});


//user routes
app.use('/ideas', ideas);
app.use('/users', users);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});