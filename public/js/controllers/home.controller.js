"use strict";

app.controller('homeController',function($scope,$rootScope){
	
});

app.controller('loginController',function($scope){

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

app.controller("loginController",function($scope,$rootScope,$state,userService){
	$scope.login = function(){

		if($scope.user.mail && $scope.user.pass){
			userService.login($scope.user.mail,$scope.user.pass).then(function(response){
				var res = response.data;
				console.log(res);
				if(res.success){
					$rootScope.me = {
						id: res.data.id,
						mail: res.data.mail,
						name:res.data.name
					};
					$state.go("home");
				}
			});
		}
	}
});

app.controller("texassController",function($scope,$element,$rootScope,$stateParams){

	//socketFactory();
	
	var room = $stateParams.room;
	
	var join_room = false;
	
	
	

	$scope.choosePlace = function($event,position){
		socket.connect();
		if(!join_room){
			console.log("emit room");
			join_room = true;
			socket.emit('room', room,function(){
				alert("room pret");
			});
		}
		
		angular.element($event.currentTarget).find('.name').text("user");
		socket.emit('newPlayer',{room:room,position:position,user:"user"});
		
	}

	$rootScope.fullpage = true;

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
				left:200,
				top:35
			},
			{
				left:265,
				top:135
			},
			{
				left:200,
				top:240
			},
			{
				left:100,
				top:270
			},
			{
				left:-100,
				top:270
			},
			{
				left:-200,
				top:240
			},
			{
				left:-256,
				top:135
			},
			{
				left:-200,
				top:35
			},
			{
				left:-100,
				top:0
			},
			{
				left:100,
				top:0,
			},
			{
				left:200,
				top:35
			},
			{
				left:265,
				top:135
			},
			{
				left:200,
				top:240
			},
			{
				left:100,
				top:270
			},
			{
				left:-100,
				top:270
			},
			{
				left:-200,
				top:240
			},
			{
				left:-256,
				top:135
			},
			{
				left:-200,
				top:35
			},
			{
				left:-100,
				top:0
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