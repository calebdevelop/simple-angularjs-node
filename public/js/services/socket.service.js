"use strict";



app.factory('socket', function () {
  var socket = io.connect();
  return socket;
});

app.service('userService',function($http){
	var api = {};

	api.register = function(user){
		return $http.post('/api/register',user);
	};

	api.login = function(mail,pass){
		return $http.post('/api/login',{mail:mail,pass:pass});
	}

	return api;
});

app.service('gameService',function($http){
	var api = {};

	api.createPlayer = function(user_id,game_id){
		return $http.get('/api/createplayer/'+ user_id + '/' + game_id + '/');
	}
});