"use strict"

var _ = require('underscore')._,
    MovieInfoHandler = require('./movie-info'),
    GenreRecommendationHandler = require('./genre-recommendation'),
    FavouriteGenreHandler = require('./favourite-genre'),
    PersonMovieHandler = require('./person-movie'),
    CommonHandler = require('./common'),
    CONSTANTS = require('./constants')

const logger = require('./logger')

class MovieBuff {

    constructor(event, context){
        logger.log(event)
        logger.log(context)
        this.event = event
        this.context = context
    }

    process(){
        logger.log('#######################################################')
        logger.log(this.event.request && this.event.request.intent && this.event.request.intent.name)
        logger.log(this.sessionAttributes())
        logger.log('#######################################################')
        var self = this
        if(self.event.request.type === 'LaunchRequest'){
            //Respond with a welcome message when the skill is launched
            self.context.succeed(
                self.generateResponse(
                    self.buildSpeechletResponse('<p>welcome to movie trivia.</p><p>if you want to know about a movie simple say something like </p><p>Alexa ask movie trivia about lord of the rings</p><p>ask for help to know more</p>', false),
                    {}
                )
            )
        }
        else if(self.event.request.type === 'IntentRequest'){
            try{
                //In case of an IntentRequest call all the handlers which will take action depending on the incoming request
                var commonHandler = new CommonHandler(this)
                var movieInfoHandler = new MovieInfoHandler(this)
                var genreRecommendationHandler = new GenreRecommendationHandler(this)
                var favouriteGenreHandler = new FavouriteGenreHandler(this)
                var personMovieHandler = new PersonMovieHandler(this)

                commonHandler.process()
                movieInfoHandler.process()
                genreRecommendationHandler.process()
                favouriteGenreHandler.process()
                personMovieHandler.process()
            }
            catch(ex){
                logger.error(ex)
                self.context.succeed(
                    self.generateResponse(
                        self.buildSpeechletResponse('<p>Movie Trivia was unable to process your request. Please try again.</p>', true),
                        {}
                    )
                )
            }
        }
    }

    //Builds the SSML speech response that will be spoken by Alexa
    buildSpeechletResponse(outputText, shouldEndSession){
        logger.exit()
        return {
            outputSpeech: {
                type: 'SSML',
                ssml: '<speak>' + outputText + '</speak>'
            },
            shouldEndSession: shouldEndSession
        }
    }

    //Generate the JSON response which will be sent to Alexa
    generateResponse(speechletResponse, sessionAttributes, card){
        if(card)
            speechletResponse.card = card
        return {
            version: "1.0",
            sessionAttributes: sessionAttributes,
            response: speechletResponse
        }
    }

    //Build a card object to display in Alexa App
    buildCard(obj, objType){
        //Build appropriate card based on the object type
        if(objType === CONSTANTS.OBJECT_MOVIE){
            return {
                type: 'Standard',
                title: obj.title,
                text: obj.overview,
                image: {
                    largeImageUrl: 'https://image.tmdb.org/t/p/w1000' + obj.poster_path
                }
            }
        }
        else if(objType === CONSTANTS.OBJECT_PERSON){
            return {
                type: 'Standard',
                title: obj.name,
                text: 'Known for ' + _.map(obj.known_for, movie => {
                    return movie.title
                }).join(', '),
                image: {
                    largeImageUrl: 'https://image.tmdb.org/t/p/w1000' + obj.profile_path
                }
            }
        }
    }

    sessionAttributes(){
        return (this.event.session && this.event.session.attributes) || {}
    }

}

module.exports = MovieBuff