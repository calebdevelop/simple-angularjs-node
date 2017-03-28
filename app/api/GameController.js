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

    this.setAndgetNextAction = function(req, res){
    	res.set('Content-Type', 'application/json')
    	req.models.games.find({game_id:req.params.game_id},function(err, game){
    		if(!Object.keys(game).length || err){
				res.json({success:false,message:"Game not exist"});
			}
			else{
				//to do get a true nextAction
				var g = game[0].getPlayers(function(err, players){
					truvUser = false;
					result = []
					var player_id;
					for(var i in players){
						if(players[i].user_id == req.params.user_id){
							switch(req.params.action){
								case 'fold':
									players[i].folded = "true"
									players[i].save(function(err){})
									break
								case 'allin':
									players[i].allIn = "true"
									players[i].save(function(err){})
									break
								case 'talked':
									players[i].talked = "true"
									players[i].save(function(err){})
									break
							}
							player_id = players[i].id
							truvUser = true;
							if((i+1) < players.length){
								result = players[i+1]
							}else{
								result = players[0]
							}
						}
					}
					//to do : voir la dernier amount Action par rapport a user_id
					if(truvUser){
						//add action 
						req.models.actions.create({action:req.params.action,amount:req.params.amount,player_id:player_id},function(err){

						})
						res.json({success:true,data:{player_id:result.player_id,position:result.position,user_id:result.user_id}})
					}
					else res.json({success:false,message:"The user is not a player on this game"})
				})
			}
    	})
    	
    }

    this.playGame = function(req, res){
    	res.set('Content-Type', 'application/json')
    	//generate aleatoire cards poker
    	
		//dispatch cards
		req.models.games.find({game_id:req.params.game_id},function(err, game){			
			if(!Object.keys(game).length || err){
				res.json({success:false,message:"Game not exist"});
			}
			else{
				//verif cards is shared
				var board_liste = JSON.parse(game[0].board)

				game[0].getPlayers().order("position").run(function(err, players){
					var nb_player = players.length
					console.log(board_liste)
					if(!Object.keys(board_liste).length){//dispatch card & get smallBlind
						var deck = new cards.PokerDeck();
				    	deck.shuffleAll();
				    	var allCards = []
				    	for(var i in deck.deck){
							allCards.push({
								suit  : deck.deck[i].suit,
								value : deck.deck[i].value
							})
						}
						index_card2 = 0
						have_bb = false
						b_index = -1
						s_index = -1
						for(var i = 0;i < nb_player; i++){
							index_card2 = i+nb_player
							
							var type = players[i].type
							if(i == 0){
								if(players[nb_player-1].type == "bigBlind"){

									b_index = i
									players[i].type = "bigBlind"
									players[i].save(function(err){
										if(err) console.log(err)
									})
								}
							}							
							if(type == "smallBlind"){
								players[i].type = "other"
								players[i].save(function(err){
									if(err) console.log(err)
								})
							}
							if(type == "bigBlind" && !have_bb){
								s_index = i
								have_bb = true
								//maj
								players[i].type = "smallBlind"
								players[i].save(function(err){
									if(err) console.log(err)
								})
								//new big blind
								if((i+1) < nb_player){
									b_index = i+1
									players[i+1].type = "bigBlind"									
									players[i+1].save(function(err){
										if(err) console.log(err)
									})
								}
							}
							players[i].cards = JSON.stringify([
								allCards[i],
								allCards[index_card2]
							])
							players[i].save(function(err){
								if(err) console.log(err)
							})
							
						}
						if(s_index == -1 && b_index == -1){
							players[0].type = "smallBlind"
							players[0].save(function(err){
								if(err) console.log(err)
								else s_index = 0
							})
							players[1].type = "bigBlind"
							players[2].save(function(err){
								if(err) console.log(err)
								else b_index = 1
							})
						}
						var board = []
						for(i = index_card2;i < (index_card2+5);i++){
							board.push(allCards[i+1])
						}
						game[0].gameStatus = "PREFLOP"
						game[0].board = JSON.stringify(board)
						game[0].save(function(err){
							if(err) console.log(err)
						})

						//smallBlind action && bigBlind
						req.models.actions.create([
							{
								action: "smallBlind",
								amount: game[0].smallBlind,
								player_id : players[s_index].id
							},
							{
								action: "bigBlind",
								amount: game[0].bigBlind,
								player_id : players[b_index].id
							}
						],function(err,item){

						})
					}
					//filter result
					results = []
					for(var i = 0;i < nb_player; i++){
						//to do : suppr user_id
						results.push({
							"player_id" : players[i].player_id,
							"cards"     : JSON.parse(players[i].cards),
							"user_id"   : players[i].user_id,
							"position"  : players[i].position,
							"type"      : players[i].type
						})
					}			
					res.json({game_status:game[0].gameStatus,player_card:results})
				})

			}
		})
    	
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
									    			position : req.params.position,
									    			type     : "other"
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