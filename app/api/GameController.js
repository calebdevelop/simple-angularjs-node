var cards = require('cards');

module.exports = GameController

function GameController(){
	if (!(this instanceof GameController))
    	return new GameController()

    this.dispatchCard = function(req,res){


		// Create a new 52 card poker deck
		var deck = new cards.PokerDeck();

		// Shuffle the deck
		//deck.shuffleAll();

		// Draw a card
		var card = deck.draw();
		for(var i in deck.deck){
			console.log(deck.deck[i])
		}
		console.log(card)
		res.send([]);
    }

    this.getToken = function(req, res){
    	res.set('Content-Type', 'application/json');
    	req.models.users.get(req.params.user_id,function(err, user){
    		if(err) res.json([])
    		else{
    			user.getJetons().where("type",req.params.type).only("amount","type").run(function(err, token){
    				if(token.length > 0){
    					var result = {
    						amount: token[0].amount,
    						type  : token[0].type
    					}    					
    					res.json(result)
    				}
    				else
    					res.json([])
    			})
    		}
    	});
    }

    this.gamesListe = function(req, res){
    	res.set('Content-Type', 'application/json');
    	req.db.driver.execQuery("SELECT * FROM tx_games g WHERE g.id NOT IN (SELECT game_id FROM tx_gamewinners) ", function (err, data) {
    		res.json({data:data})
    	})    	
    	
    }

    this.getPlayers = function(req,res){
    	res.set('Content-Type', 'application/json')
    	/*req.models.games.find({game_id:req.params.game_id},function(err,games){
    		if(!Object.keys(games).length){
    			res.json(games)
    		}else{
    			games[0].getPlayers().order("position").run(function(err,players){
    				res.json(players)
    			})
    		}
    		
    	})*/
		req.db.driver.execQuery("SELECT g.game_id, g.gameStatus, p.id as playser_id, p.position, u.name, j.amount FROM `tx_games` g\
			LEFT JOIN tx_players p ON g.id = p.game_id\
			RIGHT JOIN users u ON p.user_id = u.id\
			LEFT JOIN jeton j ON u.id = j.user_id\
			WHERE g.game_id = ?\
			AND j.type = 'texas'\
			ORDER BY p.position ASC\
			LIMIT 0,10",[req.params.game_id],function(err,data){
				console.log(data)
				res.json(data)
			})
    }

    this.createplayer = function(req, res){
    	if (!req.body) return res.sendStatus(400)

    	res.set('Content-Type', 'application/json');
    	req.models.games.find({game_id:req.params.game_id},1,function(err,game){
    		if(err) throw err

    		if(!Object.keys(game).length){
    			res.json({success:false,message:'game not exit'})
    		}else{
    			var games = game[0]
    			games.getPlayers(function(err,Players){    				
    				if(err)throw err;
    				console.log("nb Player : " + Players.length + ' ' + games.maxPlayers)
	    			if(Players.length >= games.maxPlayers){	    				
	    				res.json({success:false,message:"the maximum player count is already reached"})
	    			}else{
	    				var game_status
	    				if(Players.length == 0){
	    					game_status = "NOT_STARTED";
	    				}else if(Players.length >= (games.minPlayers - 1)){
	    					if(games.gameStatus == "NOT_STARTED" || games.gameStatus == "SEATING")
	    					game_status = "SEATING"
	    					else game_status = games.gameStatus
	    				}
	    				

	    				var game_id = games.id
	    				console.log("test user : " + req.params.user_id)
		    			req.models.users.find({id:req.params.user_id},function(err,users){
		    				if(err) console.log("err : " + err );	    				
		    				
		    				if(!Object.keys(users).length && !err){
		    					res.json({success:false,message:"user not exit"});
		    				}
		    				else{
		    					var user = users[0]
			    				var user_id = user.id
			    				user.getPlayers(function(err,p){
			    					console.log("user.getPlayer : " + Object.keys(p).length)
			    					if(Object.keys(p).length){
			    						res.json({success:false,message:"player already exist in this gameId : " + game_id})
			    					}else{
			    						console.log(Players)
			    						//get position
			    						var checkPosition = false;
			    						for(var index in Players){
			    							if(Players[index].position == req.params.position){
			    								checkPosition = true;
			    								break;
			    							}
			    						}

			    						if(checkPosition){
			    							res.json({success:false,message:"Position already token"})
			    						}else{
			    							req.models.players.create(
									    		{
									    			user_id: user_id,
									    			game_id : game_id,
									    			position : req.params.position
									    		},
									    		function(err,data){
									    			if (err)
									    				res.json({success:false,message:err});
									    			else
										    			req.models.players.get(data.id,function(err,player){
										    				res.json({success:true,player_id:player.player_id,game_status:game_status});
										    			})
									    		}
									    	);
			    						}
			    						
			    					}
			    				})
			    				
			    			}
		    			});
	    			}
	    		})
    			
    		}
    	});

    	
    }
}