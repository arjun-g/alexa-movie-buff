"use strict"

var _ = require('underscore')._,
    MovieInfoHandler = require('./movie-info'),
    GenreRecommendationHandler = require('./genre-recommendation'),
    FavouriteGenreHandler = require('./favourite-genre'),
    PersonMovieHandler = require('./person-movie'),
    CommonHandler = require('./common'),
    CONSTANTS = require('./constants')

class MovieBuff {

    constructor(event, context){
        this.event = event
        this.context = context
    }

    process(){
        var self = this
        if(self.event.request.type === 'LaunchRequest'){
            //Respond with a welcome message when the skill is launched
            self.context.succeed(
                self.generateResponse(
                    self.buildSpeechletResponse('<p>welcome to movie buff.</p><p>if you want to know about a movie simple say something like </p><p>Alexa ask movie buff about lord of the rings</p><p>ask for help to know more</p>', true),
                    {}
                )
            )
        }
        else if(self.event.request.type === 'IntentRequest'){

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
    }

    //Builds the SSML speech response that will be spoken by Alexa
    buildSpeechletResponse(outputText, shouldEndSession){
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

}

module.exports = MovieBuff