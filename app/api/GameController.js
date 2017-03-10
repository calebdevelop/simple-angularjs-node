module.exports = GameController

function GameController(){
	if (!(this instanceof GameController))
    	return new GameController()

    this.createplayer = function(req, res){
    	if (!req.body) return res.sendStatus(400)

    	res.set('Content-Type', 'application/json');
    	req.models.games.find({game_id:req.params.game_id},1,function(err,game){
    		
    		if(!Object.keys(game).length){
    			res.json({success:false,message:'game not exit'})
    		}else{
    			var game_id = game[0].id
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