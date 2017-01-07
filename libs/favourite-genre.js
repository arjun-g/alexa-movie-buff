"use strict"

const CONSTANTS = require('./constants'),
      _ = require('underscore')._,
      MDB = require('./movies-db'),
      DB = require('./db.js')

const logger = require('./logger')

class FavouriteGenre{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        var self = this
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.FAVOURITE_GENRE:{
                logger.log('Favourite Genre called')
                var sessionAttribute = {
                    intentSequence: CONSTANTS.MOVIE_RECOMMENDATION
                }
                if(movieBuff.event.request.intent.slots.Genre && movieBuff.event.request.intent.slots.Genre.value){
                    MDB.getGenreId(movieBuff.event.request.intent.slots.Genre.value.toLowerCase())
                    .then(genreId => {
                        if(genreId !== -1){
                            DB.setFavouriteGenre(movieBuff.event.session.user.userId, genreId)
                            movieBuff.context.succeed(
                                movieBuff.generateResponse(
                                    movieBuff.buildSpeechletResponse(movieBuff.event.request.intent.slots.Genre.value.toLowerCase() + ' is set as your favourite genre. thank you.', true),
                                    sessionAttribute
                                )
                            )
                        }
                        else{
                            movieBuff.context.succeed(
                                movieBuff.generateResponse(
                                    movieBuff.buildSpeechletResponse('sorry cannot find the genre', true),
                                    {}
                                )
                            )
                        }
                    })
                }
                else{
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('sorry cannot find the genre', true),
                            {}
                        )
                    )
                }
            }
        }
    }

}

module.exports = FavouriteGenre