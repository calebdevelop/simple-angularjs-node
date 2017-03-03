"use strict";

/* NAVBAR ********/

app.directive("navBar", function(){
	return{
		restrict : 'A',
		templateUrl : "views/directives/nav.html"
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
});