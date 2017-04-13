var http = require('http')
var session = require('express-session')
module.exports = function(express,bodyParser,__path,orm) { 
	var app = express();  
	var api = express();
	app.use(session({secret:'sb=d&v-js#bd!v_ok-sjbv@%$'}))
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
	        models.jeton = db.define("jeton",
	        	{
	        		amount: Number,
	        		type  : ["texas","slot"]
	        	}
	        )
	        models.games = db.define("tx_games",
	        	{
	        		game_id : String,
	        		smallBlind : Number,
	        		bigBlind : Number,
	        		minBuyIn : Number,
	        		maxBuyIn : Number,
	        		minPlayers: { type: 'integer' },
	        		maxPlayers : { type: 'integer' },
	        		board : {type:'text',defaultValue:'[]'},
	        		gameStatus : [ "NOT_STARTED", "SEATING", "PREFLOP", "FLOP", "TURN", "RIVER", "END_HAND" ]
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
	        		player_id: {type:"text"},
	        		folded   : {type:"text", defaultValue:"false"},
	        		allIn    : {type:"text", defaultValue:"false"},
	        		talked   : {type:"text", defaultValue:"false"},
	        		cards    : {type:'text', defaultValue:'[]'},
	        		position : {type:'integer'},
	        		type     : ["smallBlind","bigBlind","other"]
	        	}
	        );
	        models.players.hasOne("user",models.users,{reverse: 'players'});
	        models.players.hasOne("game",models.games,{reverse:'players'});
	        models.gamewinners.hasOne("user",models.users);
	        models.gamewinners.hasOne("game",models.games,{reverse:'gamewinner'});
	        models.actions.hasOne("player",models.players,{reverse:'actions'});
	        models.jeton.hasOne("user",models.users,{reverse:'jetons'})

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
			models.jeton.sync()
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

	var port = 8080

	server.listen(port);

	io.on('connection', function(socket) {  
	    console.log(socket.id);
		// once a client has connected, we expect to get a ping from them saying what room they want to join
		var room;
	    socket.on('room', function(room_id) {
	        socket.join(room_id)
	        room = room_id     
	        console.log("new join on : " + room_id); 
	        var user_join_nb = 0; 
	        socket.on('newPlayer',function(data){
	        	user_join_nb++
		    	console.log('user_join_nb : ' + user_join_nb +data);



		    	//to do : Call create _player rest

				http.get('http://localhost:8080/api/createplayer/' + data.user_id + '/' + data.game_id + '/' + data.position, function(res) {
					res.on('data',function(result){
						console.log("add player result : " + result)
						var response = JSON.parse(result);
						console.log(data)
						if(response.success == true){
							console.log("Player add successfull")
							socket.broadcast.to(room_id).emit('joinGame',data)
							socket.emit("joinGame",data)
						}else{
							//to do only one soket
							console.log("addPlayerError : " + socket.id + typeof result)
							socket.emit("addPlayerError", response )
						}
					})
				}).on('error', function(e) {
				  	console.log("Got error: " + e.message)
				  	//to do only one socket show error
				  	socket.emit("addPlayerError",{success:false,message:"error"})
				});
				//end




	        	//socket.broadcast.to(room_id).emit('joinGame',data);
	        });//end new player
			socket.on("playGame",function(game_id){
				//to do join room
				console.log("playGame")
				http.get('http://localhost:8080/api/playGame/' + game_id,function(res){
					res.on('data',function(result){
						var response = JSON.parse(result)
						console.log(response)
						socket.broadcast.to(room_id).emit(response.game_status,response)
						socket.emit(response.game_status,response)
					})
				}).on('error',function(){
					console.log("playgame Error : " + e.message)
				})
			});

			socket.on("setAndNextAction",function(data){
				http.get('http://localhost:8080/api/setgetnextaction/' + data.game_id + '/' + data.user_id + '/' + data.action + '/' + data.amount, function(res){
					res.on('data', function(result){
						var response = JSON.parse(result)
						if(response.success){
							socket.broadcast.to(room_id).emit("nextAction", response)
						}
					})
				})
			})
			
	    });

		

	    io.on('disconnect', function(data){
		   console.log("disconect");
		})
	    
        var counter = io.sockets.clients(socket.room).length;
		console.log("soket nb : "+counter)
	});

	

	
}

function CallRest(){

}