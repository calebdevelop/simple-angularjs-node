module.exports = function(express,bodyParser,__path,orm) { 
	var app = express();  
	var api = express();
	app.use('/api',api);

	/* database configuration */
	api.use(orm.express("mysql://root:@localhost/poker", {
	    define: function (db, models, next) {
	        models.users = db.define("users", 
	        	{
		        	name    : String,
	        		fname   : String,
	        		mail    : String,
	        		password: String
		        }
	        );
	        next();
	    }
	}));

	var router = require('./router.js')(api,bodyParser);
	router.getAllRoute();
	var server = require('http').createServer(app);  
	var io = require('socket.io')(server);	

	var __view_dir = __path + '/public/views/';

	app.use(express.static(__dirname + '/../public'));  
	app.get('*', function(req, res,next) {  
	    res.sendFile(__view_dir + 'index.html');
	});

	server.listen(8080);

	io.on('connection', function(client) {  
	    console.log('Client connected...');

	    client.on('join', function(data) {
	        console.log(data);
	    });

	});
}