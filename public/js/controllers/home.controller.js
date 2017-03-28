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
						user_id: res.data.user_id,
						mail: res.data.mail,
						name:res.data.name
					};
					$state.go("home");
				}
			});
		}
	}
});

app.controller("texassController",function($scope,$element,$rootScope,$stateParams,gameService,$document,$state){

	$scope.playGame = true;
	$scope.myAction = false;
	//marche si dans debut app
	var socket = io();

	socket.on("contect",function(){
		console.log("connecter a socket");
		
	});

	socket.on('joinGame',function(data){
		toastr.success("New user " + data.user_id, 'Information!',{timeOut: 5000});
		//console.log($element.html());
		console.log(data);
		console.log($document.find('.position' + data.postion).html() );
		$document.find('.position-' + data.position + ' .name').text(data.name);
		$document.find('.position-' + data.position + ' .price').text(data.amount + ' €');
	});

	socket.on("addPlayerError",function(data){
		console.log(data);
		toastr.error(data.message, 'Inconceivable!',{timeOut: 5000});
		$state.reload();
	});

	socket.on("nextAction",function(data){
		console.log(data.data.user_id + ' : ' + $rootScope.me.user_id);
		if(data.data.user_id == $rootScope.me.user_id){
			$scope.$apply(function(){
				$scope.myAction = true
			});
		}
	});

	socket.on("PREFLOP",function(data){
		$scope.$apply(function(){
			$scope.playGame = false;
		});		
		console.log("PREFLOP");
		toastr.success("Game start!",'Information',{timeOut: 5000});
		setTimeout(function(){
			toastr.remove();
		},5000);
		var time = 800;
		console.log(data.player_card.length);
		var time2 = time * data.player_card.length;
		var index_card = 0;
		var i = 1;
		$document.find('.player').each(function(index,obj){
			if(data.player_card[index_card]){
				if(data.player_card[index_card].position == i){	

					if(data.player_card[index_card].type == "bigBlind"){//get bigBlind to index next action
						var nextAction;
						console.log(data.player_card[index_card]);
						if(data.player_card[index_card+1]){
							nextAction = index_card+1;
						}else{
							nextAction = 0
						}
						if(data.player_card[nextAction].user_id == $rootScope.me.user_id){
							$scope.$apply(function () {
					            $scope.myAction = true;
					        });							
						}
					}

					if($rootScope.me.user_id == data.player_card[index_card].user_id){

						var value1 = data.player_card[index_card].cards[0].value;
						var value2 = data.player_card[index_card].cards[1].value;
						var suite1;
						var color1;
						switch(data.player_card[index_card].cards[0].suit){
							case 'heart':
								suite1 = '♥';
								color1 = 'red';
								break;

							case 'diamond':
								suite1 = '♦';
								color1 = 'red';
								break;

							case 'club':
								suite1 = '♣';
								color1 = 'black';
								break;

							case 'spade':
								suite1 = '♠';
								color1 = 'black';
								break;

						}
						var suite2;
						var color2;
						switch(data.player_card[index_card].cards[1].suit){
							case 'heart':
								suite2 = '♥';
								color2 = 'red';
								break;

							case 'diamond':
								suite2 = '♦';
								color2 = 'red';
								break;

							case 'club':
								suite2 = '♣';
								color2 = 'black';
								break;

							case 'spade':
								suite2 = '♠';
								color2 = 'black';
								break;

						}
						setTimeout(function(){
							$(obj).find('.player-card-content').html('<div class="cart-outline shadow rounded ' + color1 + ' flipInY animated">\
								<div class="top">\
									<span>' + value1 + '</span>\
									<span class="type">' + suite1 + '</span>\
								</div>\
								<h1 class="center">' + suite1 + '</h1>\
								<div class="bottom">\
									<span class="type">' + suite1 + '</span>\
									<span>' + value1 + '</span>\
								</div>\
							</div>');
						},time);
						setTimeout(function(){
							$(obj).find('.player-card-content').append('<div class="cart-outline shadow rounded ' + color2 + ' flipInY2 animated m-left-30" style="margin-left:30px">\
								<div class="top">\
									<span>' + value2 + '</span>\
									<span class="type">' + suite2 + '</span>\
								</div>\
								<h1 class="center">' + suite2 + '</h1>\
								<div class="bottom">\
									<span class="type">' + suite2 + '</span>\
									<span>' + value2 + '</span>\
								</div>\
							</div>');
						},time2);
						time2 += 800;
						time += 800;
						index_card++;
					}else{
						setTimeout(function(){
							$(obj).find('.player-card-content').html('<div class="card-back flipInY animated">\
									<span data-value="A" data-title="A ♣"></span>\
								</div>');
						},time);
						setTimeout(function(){
							$(obj).find('.player-card-content').append('<div class="card-back flipInY2 animated">\
									<span data-value="A" data-title="A ♣"></span>\
								</div>');
						},time2);
						time2 += 800;
						time += 800;
						index_card++;
					}
					

					/**/
				}
			}
			i++;			
		});
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
	console.log("$rootScope");
	console.log($rootScope.me);
	//get Token Test
	gameService.getToken($rootScope.me.user_id,"texas").then(function(token){
		console.log("token");
		console.log(token);
		if(typeof token.data.amount !=  "undefined"){
			$rootScope.me.amount = token.data.amount;
		}
	});

	$scope.fold = function(){
		socket.emit("setAndNextAction",{action:"fold",game_id:room,user_id:$rootScope.me.user_id,amount:0});
	}

	$scope.playGame = function(){
		socket.connect();		
		console.log(room);
		if(!join_room){
			join_room = true;
			socket.emit("room",room);			
		}
		if(room) socket.emit("playGame",room);
	}
	
	//console.log($document.find('.table-content').html());

	$scope.choosePlace = function($event,position){
		//to do is_set position 
		
		if(!join_room){
			console.log("emit room");
			join_room = true;
			socket.emit('room', room);
		}
		console.log({room:room,position:position,user_id:$rootScope.me.user_id,name:$rootScope.me.name,game_id:room,amount:$rootScope.me.amount});
		//angular.element($event.currentTarget).find('.name').text("user");
		socket.emit('newPlayer',{room:room,position:position,user_id:$rootScope.me.user_id,name:$rootScope.me.name,game_id:room,amount:$rootScope.me.amount});
		
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