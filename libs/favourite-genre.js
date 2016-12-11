"use strict"

const CONSTANTS = require('./constants'),
      _ = require('underscore')._,
      MDB = require('./movies-db'),
      DB = require('./db.js')

class FavouriteGenre{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        var self = this
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.FAVOURITE_GENRE:{
                var sessionAttribute = {
                    intentSequence: CONSTANTS.MOVIE_RECOMMENDATION
                }
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
                                sessionAttribute
                            )
                        )
                    }
                })
            }
        }
    }

}

module.exports = FavouriteGenre