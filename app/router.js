var ApiRouter = require('./api/ApiRouter.js')

function Router(api,bodyParser){
	this.app = api
	this.bodyParser = bodyParser

	if (!(this instanceof Router))
    	return new Router(api,bodyParser)	
}

Router.prototype.getAllRoute = function(){
	ApiRouter(this.app,this.bodyParser)
	
}

module.exports = Router
