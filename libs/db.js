"use strict"

var redis = require('redis')

//You can either initiate a new Redis instance or new MongoDB instance or any other db of your choice
var db = new Redis() //new MongoDB()

module.exports = {
    getRecommendedMovies: db.getRecommendedMovies,
    addRecommendedMovie: db.addRecommendedMovie,
    getFavouriteGenre: db.getFavouriteGenre,
    setFavouriteGenre: db.setFavouriteGenre
}

function Redis(){

    var redisClient = redis.createClient(process.env.REDIS_URL)

    //Include all these 4 methods if you are implmenting your own db class
    this.getRecommendedMovies = getRecommendedMovies
    this.addRecommendedMovie = addRecommendedMovie
    this.getFavouriteGenre = getFavouriteGenre
    this.setFavouriteGenre = setFavouriteGenre

    function getRecommendedMovies(userId, callback){
        //Get list of already recommended movies of a user
        redisClient.get('recommendations:' + userId, callback)
    }

    function addRecommendedMovie(userId, movieId){
        //Add a movieId to the like of recommended movies
        redisClient.sadd('recommendations:' + userId, movieId)
    }

    function getFavouriteGenre(userId, callback){
        //Set a favorite genreId for a user
        redisClient.get('favourite-genre:' + userId, callback)
    }

    function setFavouriteGenre(userId, genreId){
        //Get the current favorite genre of a user
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