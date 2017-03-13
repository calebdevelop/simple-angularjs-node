
var AuthController = require('./AuthController.js')();
var GameController = require('./GAmeController.js')();

module.exports = function AutRouter(app,bodyParser){
	
	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))
	// parse application/json
	app.use(bodyParser.json())

	app.post('/login', AuthController.loginAction);
	app.get('/create', AuthController.create);
	app.post('/register', AuthController.register );
	app.get('/createplayer/:user_id/:game_id', GameController.createplayer);
	app.get('/dispatchCard/:game_id',GameController.dispatchCard);

}



/*module.exports = ApiRouter

function ApiRouter(app){
	this.app = app;

	if (!(this instanceof ApiRouter))
    	return new ApiRouter(app)
}

var api = ApiRouter.prototype;

api.init = function(){
	return [this.indexAction(),this.createAction()]
}

api.indexAction = function(){
	this.app.get('/', function (req, res) {
	  console.log(this.app.mountpath) //api
	  res.send('API')
	});
	return
}

api.createAction = function(){
	this.app.get('/create', function (req, res) {
	  res.send('API creat')
	});
	return
}*/
