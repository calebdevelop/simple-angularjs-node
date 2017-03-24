var md5 = require('md5');
module.exports = AuthController

function AuthController(){

	if (!(this instanceof AuthController))
    	return new AuthController()

	this.loginAction = function(req, res){
		if (!req.body) return res.sendStatus(400)
		res.set('Content-Type', 'application/json');
		req.models.users.find({mail:req.body.mail,password:md5(req.body.pass)},1,function(err,user){
			if (err) throw err;
			if(!Object.keys(user).length){
				res.json({success:false,message:"Login ou mot de passe incorrect"});
			}else{
				var sess = {
					id:user[0].id,
					mail:user[0].mail,
					name:user[0].name
				}
				req.session.user = sess
				res.json({success:true,data:sess})
			}
		});
	}

	this.getSession = function(req, res){
		res.set('Content-Type', 'application/json');
		if(Object.keys(req.session).length){
			res.json({success:true,data:req.session.user})
		}else{
			res.json({success:false})
		}
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
			password : md5(req.body.password)
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