"use strict"

var MovieBuff = require('./libs/movie-buff')

exports.handler = function(event, context){
    console.log(JSON.stringify(event, null, 2))
    var movieBuff = new MovieBuff(event, context);
    movieBuff.process();

}
