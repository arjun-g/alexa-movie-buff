"use strict"

const CONSTANTS = require('./constants')
const logger = require('./logger')

//To process common scenarios like help, stop and cancel intent
class Common{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        var self = this
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.HELP_INTENT:{
                //When user asks for help say the help message
                logger.log('Help Intent called')
                var response = '<p>if you want to know about a movie simply say like </p><p>Alexa ask movie trivia about lord of the rings</p>'
                    + '<p>if you want a movie recommendation based on a genre say something like </p><p>Alexa ask movie trivia to suggest a science fiction movie</p>'
                    + '<p>to set your favourite genre say something like </p><p>my favourite genre is science fiction</p>'
                    + '<p>to know about movie acted or directed by someone say something like </p><p>Alexa ask movie trivia to find movies by will smith</p>'
                movieBuff.context.succeed(
                    movieBuff.generateResponse(
                        movieBuff.buildSpeechletResponse(response, false),
                        {}
                    )
                )
                break;
            }
            case CONSTANTS.STOP_INTENT:
            case CONSTANTS.CANCEL_INTENT:
            {
                //When encountering a STOP/CANCEL intent say Goodbye 
                logger.log('Cancel Intent called')
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