"use strict";

/*******************************************************************************
 * [-] APP
 ******************************************************************************/
 
var app = angular.module("chat", ["ui.router","ngMaterial"]);

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

	.state("texass-holdem",{
		url : "/texass-holdem",
		templateUrl : "views/games/texass-holdem.html",
		controller : "texassController"
	})

	.state("texass-holdem-games-list",{
		url:"/texass-holdem/games-list",
		resolve:{
			game_liste: function(){
				
			}
		}
	});
	
	$locationProvider.html5Mode(true);
	
}]);

