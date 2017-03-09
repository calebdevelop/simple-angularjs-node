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

.directive("fullBg",function(){
	return{
		restrict : "A",
		link:function(scope, element, attributes){
			$('body').find('.full-page-background').css('background','url(' + attributes['fullBg'] + ') repeat');
			console.log(attributes['fullBg']);
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
})

.directive("gameContent",function(){
	return{
		restrict:"A",
		link:function(scope,element){
			var left = 0;
			var top = 0;
			var card_spacing = 2;
			var card_width = element.find('.card-back').width();
			var card_height = element.find('.card-back').height();
			var left_step =  card_width + card_spacing;
			var total_cards = element.find('.card-back').length;

			element.find('.card-back').each(function(index){
				$(this).css({
					'margin-top':'-'+top+'px',
					'margin-left':'-'+left+'px',
					'z-index': ((total_cards - index) + 1)
				});
				left = left + card_spacing;
				top += 1;
			});
		},
		controller:"texassController"
	}
});