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

app.controller("texassController",function($scope,$element){

	$scope.shareCard = function(){
		var time = 1;
		var top = 40;
		var left = -130;
		var position = [
			{
				left:100,
				top:0,
			},
			{
				left:190,
				top:60
			},
			{
				left:100,
				top:120
			},
			{
				left:0,
				top:120
			}
		];
		$element.find('.card-back').each(function(index,element){
			if(position[index]){
				setTimeout(function(){					
					$(element).css({
						'margin-top':position[index].top+'px',
						'margin-left':position[index].left+'px',
					});
				},time);
				time += 300;
			}else{
				return false;
			}
			//console.log(time + " top : " + top + " left : " + left);
		});
	}

});