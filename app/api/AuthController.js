
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
		var user = {
			name : req.body.name,
			fname : req.body.fname,
			mail : req.body.mail,
			password : req.body.password
		};
		req.models.users.create(user,function(err){
			res.set('Content-Type', 'application/json');
			if (err) {
				res.json({success:false,message:"duplicate enrty"})
			}else{
				res.json({success:true})
			}
		});
		
		
	}

	
}