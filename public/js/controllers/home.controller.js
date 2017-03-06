"use strict";

app.controller('homeController',function($scope,socket){

});

app.controller('loginController',function($scope,socket){

});

app.controller('registerController',['$scope','userService','$state',function($scope,userService,$state){

	$scope.register = function(){
		var user = {
			name: $scope.user.name,
			fname : $scope.user.fname,
			mail : $scope.user.email,
			password : $scope.user.password
		}
		userService.register(user).then(function(response){
			if(response.status == 200){
				if(response.data.success)$state.go('login');
			}
		});
	}

}]);