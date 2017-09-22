//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Add the required modules
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express        = require('express');
const app            = express();
const http           = require('http');
const session        = require('express-session');
const validator      = require('express-validator');
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const flash          = require('connect-flash');
const morgan         = require('morgan');
const methodOverride = require('method-override');
const helmet         = require('helmet');
const dotEnv         = require('dotenv').config();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set database connection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const databaseConfig = require('./config/mongo-db-context');
const env = process.env.NODE_EN || 'test';
console.log(`NODE_EN: ${env}`);
databaseConfig.pickEnv(env, app);
		
//don't show the log when it is test
if(process.env.NODE_EN !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set view engine and session
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//set helmet
app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'The Force' }));
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());

app.use(cookieParser());
app.use(validator()); ///validator is a backend validator by express 
app.use(flash()); ///flash can be use to store messages or notification on session

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs'); ///Set the view engine to EJS
app.set('views', __dirname + '/views'); ///Set the views directory
app.use(express.static(__dirname));

///Get the bootstrap, jquery, and font-awesome inside the node_module 
app.use('/js'     , express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js'     , express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css'    , express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/fonts/' , express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/font-awesome/fonts'));
app.use('/css/'   , express.static(__dirname + '/node_modules/font-awesome/css'));


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set and Initialize Routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const setRoutes = require('./config/routes-initialization');
setRoutes.initializeRoutes(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Error Handler
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use((req, res, next) => {
	let err    = new Error('Not Found');
	res.locals.title = "Entrenami";
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error   = req.app.get('NODE_ENV') === 'dev' || 'local' ? err: {};

	res.status(err.status || 500);
	res.render('error/error.ejs');
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Create Server
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(app.get('port'), () => {
	console.log(`Server Listening to Port: ${app.get('port')}`);
});

module.exports = app; // for testing