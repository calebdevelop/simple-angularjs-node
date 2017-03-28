"use strict";



app.factory('socket', function () {
	//return socketFactory();
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
		console.log('/api/createplayer/'+ user_id + '/' + game_id + '/') ;
		return $http.get('/api/createplayer/'+ user_id + '/' + game_id + '/');
	}

	api.gameList = function(){
		return $http.get('/api/gamesListe');
	}

	api.getPlayers = function(game_id){
		console.log('/api/getplayers/' + game_id);
		return $http.get('/api/getplayers/' + game_id);
	}

	api.getToken = function(user_id,type){
		console.log('/api/gettokens/' + user_id + '/' + type);
		return $http.get('/api/gettoken/' + user_id + '/' + type);
	}

	api.checksession = function(){
		return $http.get('/api/checksession');
	}

	return api;
});