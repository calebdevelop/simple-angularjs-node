
module.exports = AuthController

function AuthController(){

	if (!(this instanceof AuthController))
    	return new AuthController()

	this.loginAction = function(req, res){
		if (!req.body) return res.sendStatus(400)
	  	res.send('API')
	}

	this.create = function(req, res){
	  	res.send('Create')
	}

	this.register = function(req,res){
		if (!req.body) return res.sendStatus(400)
		req.models.users.create({name:"caleb",fname:"dev"},function(err){
			if (err) {
				console.log(err);
			}
		});
		res.set('Content-Type', 'application/json');
		res.send(req.body)
	}

	
}