"use strict";




/*******************************************************************************
 * [-] APP
 ******************************************************************************/
 
var app = angular.module("chat", ["ui.router"]);

/*******************************************************************************
 * [-] CONFIG
 ******************************************************************************/
 
app.config(["$stateProvider","$urlRouterProvider","$locationProvider",
		function($stateProvider,$urlRouterProvider,$locationProvider){
	
	/* CONFIG **************************************************************** */	
	
	//$locationProvider.html5Mode(true);
	
	$urlRouterProvider.otherwise("/");
	 
	/* STATES **************************************************************** */

    $stateProvider

	
	/* HOME ****************************************************************** */
	
	.state("home", {
        url : "/",
		templateUrl : "views/home/home.html",
		controller : "homeController"
	})
	
	/* TEST ****************************************************************** */
	
	.state("test",{
		url : "/test",
		templateUrl : "views/home/test.html",
		controller : "loginController"
	})

	/* LOGIN ****************************************************************** */

	.state("login",{
		url : "/login",
		templateUrl : "views/aut/login.html"
	})

	.state("register",{
		url : "/register",
		templateUrl : "views/aut/register.html",
		//controller : "registerController"
	})

	.state("texass",{
		url : "/texass-holdem/:room",
		templateUrl : "views/games/texass-holdem.html",
		resolve : {
			playersListe : function(gameService,$stateParams){
				return gameService.getPlayers($stateParams.room).then(function(data){
					console.log(data);
					return data.data;
				});
			}
		},
		controller : function(playersListe,$scope){
			

			var cmp = 0;
			var response = [];
			for(var i=1;i<=10;i++){
				if(typeof playersListe[cmp] != 'undefined'){
					if(i == playersListe[cmp].position){
						response.push({
							position: i,
							name: playersListe[cmp].name,
							amount: playersListe[cmp].amount,
							reserved:true
						});
						cmp++;
						continue;
					}				
				}
				response.push({
					position: i,
					name: null,
					amount: null,
					reserved:false
				});
			}
			$scope.playersListe = response;
		}
		
	})

	.state("tableListe",{
		url:"/tables-list",
		templateUrl : "views/games/tables-list.html",
		resolve :{
			games : function(gameService){
				return gameService.gameList().then(function(data){
					return data.data;
				});
			}
		},
		controller: function(games,$scope){
			console.log(games);
			$scope.liste = games.data;
		}
	});
	
	$locationProvider.html5Mode(true);
	
}]);

