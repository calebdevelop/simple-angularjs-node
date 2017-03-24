"use strict";

app.filter("playerListeFilter",function(){
	return function(input,data){
		console.log(data);
		for (var i=0; i<10; i++) {
	      input.push({position:1});
	    }

		return input;
	}
});