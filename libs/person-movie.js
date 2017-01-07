"use strict"

const CONSTANTS = require('./constants'),
      _ = require('underscore')._,
      MDB = require('./movies-db'),
      DB = require('./db.js')

class PersonMovie{

    constructor(movieBuff){
        this.movieBuff = movieBuff
    }

    process(){
        var movieBuff = this.movieBuff
        var self = this
        switch(movieBuff.event.request.intent.name){
            case CONSTANTS.PERSON_MOVIES_INTENT:{
                if(movieBuff.event.request.intent.slots.PersonName && movieBuff.event.request.intent.slots.PersonName.value){
                    var personName = movieBuff.event.request.intent.slots.PersonName.value.toLowerCase()
                    MDB.searchPerson(personName)
                    .then(persons => {
                        if(persons.length === 0){
                            return movieBuff.context.succeed(
                                movieBuff.generateResponse(
                                    movieBuff.buildSpeechletResponse('<p>Sorry couldn\'t find the person</p>', true),
                                    {}
                                )
                            )    
                        }
                        var sessionAttribute = {
                            inputName: personName,
                            intentSequence: CONSTANTS.PERSON_MOVIES_INTENT,
                            persons: persons,
                            personIndex: 0
                        }
                        var person = persons[0]
                        var response = '<p>did you mean <w role="ivona:NN">' + person.name + '</w> ?</p>'
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
                                movieBuff.buildSpeechletResponse('<p>Sorry couldn\'t find the person</p>', true),
                                {}
                            )
                        )
                    })
                }
                else{
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse('<p>Sorry couldn\'t find the person</p>', true),
                            {}
                        )
                    )
                }
                break;
            }
            case CONSTANTS.YES_INTENT:{
                var sessionAttribute = movieBuff.sessionAttributes()
                if(sessionAttribute.intentSequence === CONSTANTS.PERSON_MOVIES_INTENT){
                    var person = sessionAttribute.persons[sessionAttribute.personIndex]
                    var response = '<p>some of the top movies by <w role="ivona:NN">' + person.name + '</w>'
                        + ' are '
                        + _.map(person.known_for, movie => {
                            return '<w role="ivona:NN">' + movie.title + '</w>'
                        }).join(', ')
                        + '</p>'
                    movieBuff.context.succeed(
                        movieBuff.generateResponse(
                            movieBuff.buildSpeechletResponse(response, true),
                            sessionAttribute,
                            movieBuff.buildCard(person, CONSTANTS.OBJECT_PERSON)
                        )
                    )
                }
                break;
            }
            case CONSTANTS.NO_INTENT:{
                var sessionAttribute = movieBuff.sessionAttributes()
                if(sessionAttribute.intentSequence === CONSTANTS.PERSON_MOVIES_INTENT){
                    sessionAttribute.personIndex++
                    if(sessionAttribute.persons.length === sessionAttribute.personIndex){
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse('<p>Sorry couldn\'t find the person</p>', true),
                                sessionAttribute
                            )
                        )
                    }
                    else{
                        var person = persons[sessionAttribute.personIndex]
                        var response = '<p>did you mean <w role="ivona:NN">' + person.name + '</w> ?</p>'
                        movieBuff.context.succeed(
                            movieBuff.generateResponse(
                                movieBuff.buildSpeechletResponse(response, false),
                                sessionAttribute
                            )
                        )
                    }
                }
                break;
            }
        }
    }

}

module.exports = PersonMovie