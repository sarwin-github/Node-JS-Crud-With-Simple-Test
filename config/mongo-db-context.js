const session    = require('express-session');
const mongoose   = require('mongoose');
const mongoStore = require('connect-mongo')(session);

process.env.MongoDBLocalUser     = 'sarwin';
process.env.MongoDBLocalPassword = '01610715';
process.env.sessionKey           = 'sessionKeySecret';

// Local connection
let mongoConnectionLocal = {	
	'url': `mongodb://${process.env.MongoDBLocalUser}:${process.env.MongoDBLocalPassword}@127.0.0.1:27017/book`
};

// Local connection
let mongoConnectionTest = {	
	'url': `mongodb://${process.env.MongoDBLocalUser}:${process.env.MongoDBLocalPassword}@127.0.0.1:27017/book-test`
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (env, app) => {
	mongoose.Promise = global.Promise;
	switch (env) {
		case 'local':
	    	app.set('port', process.env.PORT || 9091);
	        mongoose.connect(mongoConnectionLocal.url, {auth:{authdb:"admin"}},  
	        	err => { if(err) { console.log(err); }});
			break;
		case 'test':
	    	app.set('port', process.env.PORT || 9091);
	        mongoose.connect(mongoConnectionTest.url, {auth:{authdb:"admin"}},  
	        	err => { if(err) { console.log(err); }});
			break;
	};

	// Set session and cookie max life, store session in mongo database
	app.use(session({
		secret : process.env.sessionKey,    
		resave : true,
	  	saveUninitialized: false, 
		store  : new mongoStore({ mongooseConnection: mongoose.connection }),
		cookie : { maxAge: 60 * 60 * 1000}
	}));
};
