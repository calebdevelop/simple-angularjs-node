"use strict";

/* NAVBAR ********/

app.directive("navBar", function(){
	return{
		restrict : 'A',
		templateUrl : "views/directives/nav.html",
		controller : function($scope,$location){
			$scope.isActive = function(path){
				return path === $location.path();
			};
		}
	}
})

.directive("topHeader", function(){
	return{
		restrict : "A",
		templateUrl : "views/directives/top-header.html"
	}
})

.directive("uiFooter", function(){
	return{
		restrict : "A",
		templateUrl : "views/directives/footer.html"
	}
})

.directive("materialInput",function(){
	return{
		restrict : "A",
		link : function(scope,element,attr){
			element.find('input').on('focus',function(){
				element.addClass('is-focused');				
			});
			element.find('input').on('blur',function(){
				element.removeClass('is-focused');
			});
		}
	}
});