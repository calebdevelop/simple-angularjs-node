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

	return api;
});