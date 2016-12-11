"use strict"

//Library for handling all incoming request and responding appropriately
var MovieBuff = require('./libs/movie-buff')

//Entry point. Lambda functions should have the signature "exports.handler = function() { ... }" 
exports.handler = (event, context) => {
    
    //Calling the MovieBuff class that handles all incoming requests
    var movieBuff = new MovieBuff(event, context);
    movieBuff.process();

}
