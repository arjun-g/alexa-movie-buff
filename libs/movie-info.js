"use strict"

const CONSTANTS = require('./constants'),
      _ = require('underscore')._,
      MDB = require('./movies-db')

//To process all scenarios of MovieInfo intent
class MovieInfo{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        console.log('#######################################################')
        console.log(movieBuff.event.request.intent.name)
        console.log(movieBuff.event.session.attributes.intentSequence)
        console.log('#######################################################')
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.MOVIE_INFO_INTENT:{ //When MovieInfo intent is called along with the movie name in the slot
                if(movieBuff.event.request.intent.slots.Name && movieBuff.event.request.intent.slots.Name.value){
                    MDB.searchMovies(movieBuff.event.request.intent.slots.Name.value)
                    .then(movies => {
                        var sessionAttribute = {
                            inputName: movieBuff.event.request.intent.slots.Name.value,
                            movies: movies,
                            movieIndex: 0,
                            intentSequence: CONSTANTS.MOVIE_INFO_INTENT
                        }
                        //Ask user if this movie is what the user is expecting
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
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse('Failed to find the movie', true),
                                {}
                            )
                        )
                    })
                }
                else{
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('Failed to find the movie', true),
                            {}
                        )
                    )
                }
                break;
            }
            case CONSTANTS.YES_INTENT: {
                var sessionAttribute = movieBuff.event.session.attributes
                if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT){ //When the user answers YES after alexa asks if this the movie that user expects
                    sessionAttribute.intentSequence = sessionAttribute.intentSequence + ';' + CONSTANTS.YES_INTENT
                    var movie = sessionAttribute.movies[sessionAttribute.movieIndex]
                    sessionAttribute.movies = [movie]
                    //Respond with movie details and ask user where he/she likes to know about the movie casts
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
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT){ //When the user answer YES after alexa asks if he/she wants to know about a movie casts
                    sessionAttribute.intentSequence = CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.YES_INTENT
                    var movie = sessionAttribute.movies[0]
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
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.YES_INTENT || sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.NO_INTENT){ //When the user answers YES when asked whether he/she wants to know similar movies
                    var movie = sessionAttribute.movies[0]
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
                                {}
                            )
                        )
                    })
                }
                break;
            }
            case CONSTANTS.NO_INTENT: {
                var sessionAttribute = movieBuff.event.session.attributes
                if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT){ //When user says NO when askd if this the movie that user expected
                    sessionAttribute.movieIndex++
                    if(sessionAttribute.movieIndex === sessionAttribute.movies.length){ //When no more movies is found
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse('<p>Sorry couldn\'t find movie</p>', true),
                                {}
                            )
                        )
                    }
                    else{ //Iterate to next movie in list
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
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT){ //When user answers NO when alexa asks if they want to know the casts of a movie 
                    sessionAttribute.intentSequence = CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.NO_INTENT
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('would you like to know about similar movies', false),
                            sessionAttribute
                        )
                    )
                }
                else if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.NO_INTENT || sessionAttribute.intentSequence === CONSTANTS.MOVIE_INFO_INTENT + ';' + CONSTANTS.YES_INTENT + ';' + CONSTANTS.YES_INTENT){ //When user asnwers NO when alexa ask if they want to know similar movies
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('Goodbye!', true),
                            {}
                        )
                    )
                }
                break;
            }
        }
    }
}

module.exports = MovieInfo