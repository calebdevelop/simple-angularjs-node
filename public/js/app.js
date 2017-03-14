"use strict";

/*******************************************************************************
 * [-] APP
 ******************************************************************************/
 
var app = angular.module("chat", ["ui.router",'btford.socket-io']);

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
		controller : "texassController"
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

