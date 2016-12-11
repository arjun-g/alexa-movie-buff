"use strict"

const CONSTANTS = require('./constants'),
      _ = require('underscore')._,
      MDB = require('./movies-db'),
      DB = require('./db.js')

class GenreRecommendation{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        var self = this
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.MOVIE_RECOMMENDATION:{
                if(movieBuff.event.request.intent.slots && movieBuff.event.request.intent.slots.Genre && movieBuff.event.request.intent.slots.Genre.value){
                    var sessionAttribute = {
                        intentSequence: CONSTANTS.MOVIE_RECOMMENDATION
                    }
                    MDB.getGenreId(movieBuff.event.request.intent.slots.Genre.value.toLowerCase())
                    .then(genreId => {
                        if(genreId !== -1){
                            self.sayAboutGenreMovie(genreId, movieBuff.event.request.intent.slots.Genre.value.toLowerCase(), sessionAttribute)
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
                else{
                    DB.getFavouriteGenre(movieBuff.event.session.user.userId, function(err, genreId){
                        if(err || !genreId){
                            var sessionAttribute = {
                                intentSequence: CONSTANTS.MOVIE_RECOMMENDATION
                            }
                            movieBuff.context.succeed(
                                movieBuff.generateResponse(
                                    movieBuff.buildSpeechletResponse('<p>please set you favourite genre first. to set a favourite genre say something like </p><p>alexa say movie buff my favourite genre is science fiction</p>', false),
                                    sessionAttribute
                                )
                            )
                        }
                        else{
                            var sessionAttribute = {
                                intentSequence: CONSTANTS.MOVIE_RECOMMENDATION
                            }
                            MDB.getGenreName(genreId)
                            .then(genreName => {
                                self.sayAboutGenreMovie(genreId, genreName, sessionAttribute)
                            })
                        }
                    })
                }
                break;
            }
            case CONSTANTS.YES_INTENT:{
                var sessionAttribute = movieBuff.event.session.attributes
                if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_RECOMMENDATION){
                    self.sayAboutGenreMovie(sessionAttribute.genreId, sessionAttribute.genreName, sessionAttribute)
                }
                break;
            }
            case CONSTANTS.NO_INTENT:{
                var sessionAttribute = movieBuff.event.session.attributes
                if(sessionAttribute.intentSequence === CONSTANTS.MOVIE_RECOMMENDATION){
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

    sayAboutGenreMovie(genreId, genreName, sessionAttribute){
        var movieBuff = this.movieBuff
        this.getUniqueMovieRecommendation(genreId)
        .then(movie => {

            MDB.movieCasts(movie.id)
            .then(casts => {
                var response = '<p><w role="ivona:NN">' + movie.title + '</w>'
                    + ' released on '
                    + movie.release_date
                    + '. '
                    + movie.overview
                    + '</p>'
                    + '<p>the casts of the movie comprises of '
                    + _.map(casts, function(cast){
                            return '<w role="ivona:NN">' + cast.name + '</w>'
                        }).join(', ')
                    + '</p><p>would you like to know about another ' + genreName + ' movie ?</p>'
                sessionAttribute.movieId = movie.id
                sessionAttribute.genreId = genreId
                sessionAttribute.genreName = genreName
                movieBuff.context.succeed(
                    movieBuff.generateResponse(
                        movieBuff.buildSpeechletResponse(response, false),
                        sessionAttribute,
                        movieBuff.buildCard(movie, CONSTANTS.OBJECT_MOVIE)
                    )
                )
            })
        })
    }

    getUniqueMovieRecommendation(genreId){
        var movieBuff = this.movieBuff
        var userId = movieBuff.event.session.user.userId
        return new Promise((resolve, reject) => {
            DB.getRecommendedMovies(userId, (err, recommendedIds) => {
                if(!recommendedIds)
                    recommendedIds = []
                findMovie(0, movies => {
                    var movie = _.sample(movies)
                    DB.addRecommendedMovie(userId, movie.id.toString())
                    resolve(movie)
                })
                function findMovie(page, callback){
                    MDB.findGenreMovies(genreId, page)
                    .then(movies => {
                        var movieIds = _.pluck(movies, 'id')
                        var diff = _.difference(movieIds, recommendedIds)
                        if(diff.length == 0){
                            findMovie(++page, callback)
                        }
                        else{
                            var filteredMovies = _.filter(movies, movie => {
                                return diff.indexOf(movie.id) >= 0
                            })
                            callback(filteredMovies)
                        }
                    })
                }
            })
        })
    }

}

module.exports = GenreRecommendation