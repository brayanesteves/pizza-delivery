const express = require('express');
const morgan = require('morgan');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys')
const passport = require('passport');
/**
 * La plantilla que muestra en el routes/index.js
 */
const expshbs = require('express-handlebars');
// Initializations
const app = express();
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
/**
 * Motor Handlebars
 */
app.engine('.hbs', expshbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    // Puedes clocar cualquier nombre
    secret: 'innoscripta',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use((req, res, next) => {
    /**
     * app.locals.success <.success es el nombre de la variable>
     */
    app.locals.success =  req.flash('success');
    app.locals.message =  req.flash('message');
    /**
     * Es para acceder a lainformación del usuario consultado en la base de datos
     * en 'profile.hbs'
     */
    app.locals.user =  req.user;
    // res.locals is an object passed to hbs engine
    res.locals.session = req.session;
    next();
});

// Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use('/cmds', require('./routes/cmds'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});