"use strict";

app.controller('homeController',function($scope,socket){

});

app.controller('loginController',function($scope,socket){

});

app.controller('registerController',['$scope','userService',function($scope,userService){

	$scope.register = function(){
		userService.register().then(function(response){
			console.log(response);
		});
	}

}]);