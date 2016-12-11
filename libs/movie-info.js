"use strict"

const CONSTANTS = require('./constants'),
      _ = require('underscore')._,
      MDB = require('./movies-db')

class MovieInfo{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.MOVIE_INFO_INTENT:{
                MDB.searchMovies(movieBuff.event.request.intent.slots.Name.value)
                .then(movies => {
                    var sessionAttribute = {
                        inputName: movieBuff.event.request.intent.slots.Name.value,
                        movies: movies,
                        movieIndex: 0,
                        intentSequence: CONSTANTS.MOVIE_INFO_INTENT
                    }
                    var movie = movies[0]
                    var response = '<p>did you mean <w role="ivona:NN">' + movie.title + '</w> ?</p>'                     
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse(response, false),
                            sessionAttribute
                        )
                    )
                })
                .catch(err => {
                    console.log(err)
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('Failed to find the movie', true),
                            {}
                        )
                    )
                })
                break;
            }
            case CONSTANTS.YES_INTENT: {
                var sessionAttribute = movieBuff.event.session.attributes
                if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT){
                    sessionAttribute.intentSequence = sessionAttribute.intentSequence + ';' + CONSTANTS.YES_INTENT
                    var movie = sessionAttribute.movies[sessionAttribute.movieIndex]
                    var response = '<p><w role="ivona:NN">' + movie.title + '</w>'
                        + ' released on '
                        + movie.release_date
                        + '. '
                        + movie.overview
                        + '</p>'
                        + '<p>do you like to know about the casts ?</p>'
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse(response, false),
                            sessionAttribute,
                            movieBuff.buildCard(movie, CONSTANTS.OBJECT_MOVIE)
                        )
                    )
                }
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT){
                    sessionAttribute.intentSequence = CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.YES_INTENT
                    var movie = sessionAttribute.movies[sessionAttribute.movieIndex]
                    MDB.movieCasts(movie.id)
                    .then(casts => {
                        var response = '<p>the casts comprises of '
                            + _.map(casts, function(cast){
                                return '<w role="ivona:NN">' + cast.name + '</w>'
                              }).join(', ')
                            + '</p> <p>do you like to know about similar movies ?</p>'
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse(response, false),
                                sessionAttribute
                            )
                        )
                    })
                }
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.YES_INTENT || sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.NO_INTENT + ';' + CONSTANTS.YES_INTENT){
                    var movie = sessionAttribute.movies[sessionAttribute.movieIndex]
                    MDB.similarMovies(movie.id)
                    .then(movies => {
                        var response = '<p>some of the silimar movies are '
                            + _.map(movies, function(movie){
                                return '<w role="ivona:NN">' + movie.title + '</w>'
                            }).join(', ')
                            + '</p><p>Goodbye!</p>'
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse(response, true),
                                sessionAttribute
                            )
                        )
                    })
                }
                break;
            }
            case CONSTANTS.NO_INTENT: {
                var sessionAttribute = movieBuff.event.session.attributes
                if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT){
                    sessionAttribute.movieIndex++
                    if(sessionAttribute.movieIndex === sessionAttribute.movies.length){
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse('<p>Sorry couldn\'t find movie</p>', true),
                                sessionAttribute
                            )
                        )
                    }
                    else{
                        var movie = sessionAttribute.movies[sessionAttribute.movieIndex]
                        var response = '<p>do you mean <w role="ivona:NN">' + movie.title + '</w> ?</p>'                     
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse(response, false),
                                sessionAttribute
                            )
                        )
                    }
                }
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT){
                    sessionAttribute.intentSequence = CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.NO_INTENT
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('would you like to know about similar movies', false),
                            sessionAttribute
                        )
                    )
                }
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.NO_INTENT){
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('Goodbye!', true),
                            sessionAttribute
                        )
                    )
                }
                break;
            }
        }
    }
}

module.exports = MovieInfo