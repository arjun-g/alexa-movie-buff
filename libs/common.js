"use strict"

const CONSTANTS = require('./constants')

class Common{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        var self = this
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.HELP_INTENT:{
                var sessionAttribute = {
                    intentSequence: CONSTANTS.HELP_INTENT
                }
                var response = '<p>if you want to know about a movie simply say like </p><p>Alexa ask movie buff about lord of the rings</p>'
                    + '<p>if you want a movie recommendation based on a genre say something like </p><p>Alexa ask movie buff to suggest a science fiction movie</p>'
                    + '<p>to set your favourite genre say something like </p><p>my favourite genre is science fiction</p>'
                    + '<p>to know about movie acted or directed by someone say somethign like </p><p>Alexa ask movie buff to find movies by will smith</p>'
                movieBuff.context.succeed(
                    movieBuff.generateResponse(
                        movieBuff.buildSpeechletResponse(response, true),
                        sessionAttribute
                    )
                )
                break;
            }
            case CONSTANTS.STOP_INTENT:
            case CONSTANTS.CANCEL_INTENT:
            {
                movieBuff.context.succeed(
                    movieBuff.generateResponse(
                        movieBuff.buildSpeechletResponse('Goodbye!', true),
                        {}
                    )
                )
                break;
            }
        }
    }

}

module.exports = Common