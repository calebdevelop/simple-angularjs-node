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
						user_id: res.data.id,
						mail: res.data.mail,
						name:res.data.name
					};
					$state.go("home");
				}
			});
		}
	}
});

app.controller("texassController",function($scope,$element,$rootScope,$stateParams,gameService,$document){


	//marche si dans debut app
	var socket = io();
	socket.on("contect",function(){
		console.log("connecter a socket");
		
	});

	socket.on('joinGame',function(data){
		toastr.success("New user " + data.user_id, 'Information!',{timeOut: 5000});
		//console.log($element.html());
		console.log("join : " + data);
		console.log($document.find('.position' + data.postion).html() );
		$document.find('.position-' + data.position + ' .name').text($rootScope.me.user_id);
		
	});

	socket.on("addPlayerError",function(data){
		console.log(data);
		toastr.error(data.message, 'Inconceivable!',{timeOut: 5000})
	});


	//

	//socketFactory();
	
	var room = $stateParams.room;
	
	var join_room = false;
	
	//to do : $rootscope
	if(!$rootScope.me)
	$rootScope.me = {
		user_id:1,
		room:room,
		//amount:2000,
		name:"caleb",
		mail:"test@gmail.com"
	};
	else{
		$rootScope.me.room = room;
	}
	//get Token Test
	gameService.getToken($rootScope.me.user_id,"texas").then(function(token){
		console.log("token");
		console.log(token);
		if(typeof token.data.amount !=  "undefined"){
			$rootScope.me.amount = token.data.amount;
		}
	});
	
	//console.log($document.find('.table-content').html());

	$scope.choosePlace = function($event,position){
		//to do is_set position 
		socket.connect();
		if(!join_room){
			console.log("emit room");
			join_room = true;
			socket.emit('room', room);
		}
		
		//angular.element($event.currentTarget).find('.name').text("user");
		socket.emit('newPlayer',{room:room,position:position,user_id:$rootScope.me.user_id,game_id:room,amount:$rootScope.amount});
		
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