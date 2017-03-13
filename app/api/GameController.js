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

    this.createplayer = function(req, res){
    	if (!req.body) return res.sendStatus(400)

    	res.set('Content-Type', 'application/json');
    	req.models.games.find({game_id:req.params.game_id},1,function(err,game){
    		

    		if(!Object.keys(game).length){
    			res.json({success:false,message:'game not exit'})
    		}else{
    			var games = game[0]
    			games.getPlayers(function(err,Players){
    				console.log(Players.length + ' ' + games.maxPlayers)
	    			if(Players.length >= games.maxPlayers){
	    				res.json({success:false,message:"the maximum player count is already reached"})
	    			}
	    		})
    			var game_id = games.id
    			req.models.users.get(req.params.user_id,function(err,user){
    				if(!Object.keys(user).length){
    					res.json({success:false,message:"user not exit"});
    				}
    				else{
	    				var user_id = user.id
	    				user.getPlayers(function(err,p){
	    					console.log(Object.keys(p).length)
	    					if(Object.keys(p).length){
	    						res.json({success:false,message:"player already exist in this gameId : " + game_id})
	    					}else{
	    						req.models.players.create(
						    		{
						    			user_id: user_id,
						    			game_id : game_id
						    		},
						    		function(err,data){
						    			if (err)
						    				res.json({success:false,message:err});
						    			else
							    			req.models.players.get(data.id,function(err,player){
							    				res.json({success:true,player_id:player.player_id});
							    			})
						    		}
						    	);
	    					}
	    				})
	    				
	    			}
    			});
    		}
    	});

    	
    }
}