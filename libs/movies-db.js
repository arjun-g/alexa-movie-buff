"use strict"

var mdb = require('moviedb')(process.env.MDB_API_KEY),
    _ = require('underscore')._

module.exports = {
    searchMovies: searchMovies,
    similarMovies: similarMovies,
    movieCasts: movieCasts,
    searchPerson: searchPerson,
    moviesBy: moviesBy,
    findGenreMovies: findGenreMovies,
    getGenreId: getGenreId,
    getGenreName: getGenreName
}

function searchMovies(query){
    return new Promise((resolve, reject) => {
        mdb.searchMovie({
            query: query
        }, function(err, res){
            if(err) return reject(err)
            if(res && res.results && res.results.length > 0){
                resolve(
                    _.map(res.results.slice(0, 10), movie => {
                        return compactMovie(movie)
                    })
                )
            }
            else{
                reject('Not found')
            }
        })
    })
}

function similarMovies(movieId){
    return new Promise((resolve, reject) => {
        mdb.movieSimilar({
            id: movieId
        }, function(err, res){
            if(err) return reject(err)
            resolve(
                _.map(res.results.slice(0, 10), movie => {
                    return compactMovie(movie)
                })
            )
        })
    })
}

function movieCasts(movieId){
    return new Promise((resolve, reject) => {
        mdb.movieCredits({
            id: movieId
        }, function(err, res){
            if(err) return reject(err)
            resolve(_.chain(res.cast)
                        .sortBy('order')
                        .value()
                        .slice(0, 5))
        })
    })
}

function searchPerson(query){
    return new Promise((resolve, reject) => {
        mdb.searchPerson({
            query: query
        }, function(err, res){
            if(err) return reject(err)
            if(res && res.results && res.results.length > 0){
                resolve(
                    _.map(res.results, person =>{
                        return compactPerson(person)
                    }).slice(0, 10)
                )
            }
            else{
                reject('Not found')
            }
        })
    })
}

function moviesBy(personId){
    return new Promise((resolve, reject) => {
        mdb.discoverMovie({
            with_people: personId,
            sort_by: 'vote_average.desc'
        }, function(err, res){
            if(err) return reject(err)
            if(res && res.results && res.results.length > 0){
                resolve(
                    _.map(res.results.slice(0, 5), movie => {
                        return compactMovie(movie)
                    })
                )
            }
            else{
                reject('Not found')
            }
        })
    })
}

function findGenreMovies(genreId, page){
    return new Promise((resolve, reject) => {
        mdb.genreMovies({
            id: genreId,
            popularity: 'popularity.desc',
            page: page ? page : undefined
        }, function(err, res){
            if(err) return reject(err)
            if(res && res.results && res.results.length > 0){
                resolve(
                    _.map(res.results, movie => {
                        return compactMovie(movie)
                    })
                )
            }
            else{
                reject('Not found')
            }
        })
    })
}

var genres = [
    {
      "id": 28,
      "name": "action"
    },
    {
      "id": 12,
      "name": "adventure"
    },
    {
      "id": 16,
      "name": "animation"
    },
    {
      "id": 35,
      "name": "comedy"
    },
    {
      "id": 80,
      "name": "crime"
    },
    {
      "id": 99,
      "name": "documentary"
    },
    {
      "id": 18,
      "name": "drama"
    },
    {
      "id": 10751,
      "name": "family"
    },
    {
      "id": 14,
      "name": "fantasy"
    },
    {
      "id": 36,
      "name": "history"
    },
    {
      "id": 27,
      "name": "horror"
    },
    {
      "id": 10402,
      "name": "music"
    },
    {
      "id": 9648,
      "name": "mystery"
    },
    {
      "id": 10749,
      "name": "romance"
    },
    {
      "id": 10749,
      "name": "romantic"
    },
    {
      "id": 878,
      "name": "science fiction"
    },
    {
      "id": 878,
      "name": "si fi"
    },
    {
      "id": 878,
      "name": "sifi"
    },
    {
      "id": 53,
      "name": "thriller"
    },
    {
      "id": 10752,
      "name": "war"
    },
    {
      "id": 37,
      "name": "western"
    }
  ]

function getGenreId(genre){
    return new Promise((resolve, reject) => {
        var currentGenre = _.findWhere(genres, { name: genre.toLowerCase() })
        if(currentGenre)
            resolve(currentGenre.id)
        else
            resolve(-1)
    })
}

function getGenreName(genreId){
    genreId = parseInt(genreId)
    return new Promise((resolve, reject) => {
        var currentGenre = _.findWhere(genres, { id: genreId })
        if(currentGenre)
            resolve(currentGenre.name)
        else
            resolve('')
    })
}

function compactPerson(person){
    var compactPerson = {
        id: person.id,
        name: person.name,
        profile_path: person.profile_path,
        known_for: _.map(person.known_for, movie => {
            return {
                title: movie.title
            }
        })
    }
    return compactPerson
}

function compactMovie(movie){
    var compactMovie = {
        id: movie.id,
        title: movie.title,
        original_title: movie.original_title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path
    }
    return compactMovie
}