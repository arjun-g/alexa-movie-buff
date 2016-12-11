"use strict"

var redis = require('redis')

var db = new Redis()

module.exports = {
    getRecommendedMovies: db.getRecommendedMovies,
    addRecommendedMovie: db.addRecommendedMovie,
    getFavouriteGenre: db.getFavouriteGenre,
    setFavouriteGenre: db.setFavouriteGenre
}

function Redis(){

    var redisClient = redis.createClient(process.env.REDIS_URL)

    this.getRecommendedMovies = getRecommendedMovies
    this.addRecommendedMovie = addRecommendedMovie
    this.getFavouriteGenre = getFavouriteGenre
    this.setFavouriteGenre = setFavouriteGenre

    function getRecommendedMovies(userId, callback){
        redisClient.get('recommendations:' + userId, callback)
    }

    function addRecommendedMovie(userId, movieId){
        redisClient.sadd('recommendations:' + userId, movieId)
    }

    function getFavouriteGenre(userId, callback){
        redisClient.get('favourite-genre:' + userId, callback)
    }

    function setFavouriteGenre(userId, genreId){
        redisClient.set('favourite-genre:' + userId, genreId)
    }
}

function MongoDB(){

    this.getRecommendedMovies = getRecommendedMovies
    this.addRecommendedMovie = addRecommendedMovie
    this.getFavouriteGenre = getFavouriteGenre
    this.setFavouriteGenre = setFavouriteGenre

    function getRecommendedMovies(userId, callback){
        //TODO
    }

    function addRecommendedMovie(userId, movieId){
        //TODO
    }

    function getFavouriteGenre(userId, callback){
        //TODO
    }

    function setFavouriteGenre(userId, genreId){
        //TODO
    }
}