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
	        models.games = db.define("tx_games",
	        	{
	        		game_id : String,
	        		smallBlind : Number,
	        		bigBlind : Number,
	        		minBuyIn : Number,
	        		maxBuyIn : Number,
	        		minPlayers: { type: 'integer' },
	        		maxPlayers : { type: 'integer' },
	        		board : {type:'text',defaultValue:'[]'}
	        	}
	        );
	        models.actions = db.define("tx_actions",
		        {
		        	action : String,
		        	amount : {type:'number',defaultValue:0}
		        }
	        );
	        models.gamewinners = db.define("tx_gamewinners",
		        {
		        	amount : Number,
		        	chips  : Number
		        }
	        );
	        models.players = db.define('tx_players',
	        	{
	        		player_id: String,
	        		folded   : {type:"text",defaultValue:"false"},
	        		allIn    : {type:"text",defaultValue:"false"},
	        		talked   : {type:"text",defaultValue:"false"},
	        		cards    : {type:'text',defaultValue:'[]'}
	        	}
	        );
	        models.players.hasOne("user",models.users,{reverse: 'players'});
	        models.players.hasOne("game",models.games,{reverse:'players'});
	        models.gamewinners.hasOne("user",models.users);
	        models.gamewinners.hasOne("game",models.games,{reverse:'gamewinner'});
	        models.actions.hasOne("player",models.players,{reverse:'actions'});

			/*models.players(1).getUser(function(err,user){
				console.log(user)
			});
			models.users(1).getPlayers(function(err,player){
				console.log(player)
			});
			models.users(1).addPlayers(
				{
	    			game_id : "ok",
	    			cards:[]
	    		},
	    		function(err){

				}
			);*/
			models.actions.sync()
			models.gamewinners.sync()
			models.games.sync()
			models.players.sync()
			models.users.sync()
			db.sync()
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

	io.on('connection', function(socket) {  
	    console.log(socket.id);
		// once a client has connected, we expect to get a ping from them saying what room they want to join
		var room;
	    socket.on('room', function(room_id) {
	        socket.join(room_id)
	        room = room_id     
	        console.log("join");   
	    });
	    socket.on('newPlayer',function(data){
	    	console.log(data);
        	socket.broadcast.to(room).emit('joinGame',data);
        })
	});
}