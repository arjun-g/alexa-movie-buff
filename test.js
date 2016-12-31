var bst = require('bespoken-tools');
var server = null;
var alexa = null;

describe('Streamer', function () {
    beforeEach(function (done) {
        server = new bst.LambdaServer('./index.js', 8080, true);
        alexa = new bst.BSTAlexa('http://localhost:8080',
            'speechAssets/IntentSchema.json',
            'speechAssets/SampleUtterances.txt');
        server.start(function () {
            alexa.start(function (error) {
                if (error !== undefined) {
                    console.error("Error: " + error);
                } else {
                    console.log("success")
                    done();
                }
            });
        });
    });

    afterEach(function (done) {
        alexa.stop(function () {
            server.stop(function () {
                done();
            });
        });
    });

    it('Search for movie and iterate to second option and say yes to both casts and similar movies', function (done) {
        this.timeout(20000);
        alexa.spoken('find about {lord of the rings}', function (error, response) {
            alexa.spoken('yes', function (error, response) {
                alexa.spoken('yes', function (error, response) {
                    alexa.spoken('yes', function (error, response) {
                        done()
                    })
                })
            })
        });
    });

    it('Search for movie and iterate to second option and say no casts and yes to similar movies', function (done) {
        this.timeout(20000);
        alexa.spoken('find about {lord of the rings}', function (error, response) {
            alexa.spoken('yes', function (error, response) {
                alexa.spoken('no', function (error, response) {
                    alexa.spoken('yes', function (error, response) {
                        done()
                    })
                })
            })
        });
    });

    it('Search for movie and iterate to second option and say yes casts and no to similar movies', function (done) {
        this.timeout(20000);
        alexa.spoken('find about {lord of the rings}', function (error, response) {
            alexa.spoken('yes', function (error, response) {
                alexa.spoken('yes', function (error, response) {
                    alexa.spoken('no', function (error, response) {
                        done()
                    })
                })
            })
        });
    });

    it('Search for movie and iterate to second option and say no to both casts and similar movies', function (done) {
        this.timeout(20000);
        alexa.spoken('find about {lord of the rings}', function (error, response) {
            alexa.spoken('yes', function (error, response) {
                alexa.spoken('no', function (error, response) {
                    alexa.spoken('no', function (error, response) {
                        done()
                    })
                })
            })
        });
    });

    it('Ask for a movie suggestion and say yes twice to know about 2 movies', function (done) {
        this.timeout(20000);
        alexa.spoken('suggest a {war} movie', function (error, response) {
            alexa.spoken('yes', function (error, response) {
                alexa.spoken('yes', function (error, response) {
                    alexa.spoken('no', function (error, response) {
                        done()
                    })
                })
            })
        });
    });

    it('Ask for movie suggestion then ask the user set a favorite genre which he/she will set and again ask for a movie suggestion', function (done) {
        this.timeout(20000);
        alexa.spoken('suggest a movie', function (error, response) {
            alexa.spoken('my favourite genre is {war}', function (error, response) {
                alexa.spoken('suggest a movie', function (error, response) {
                    alexa.spoken('yes', function (error, response) {
                        alexa.spoken('no', function (error, response) {
                            done()
                        })
                    })
                })
            })

        });
    });

    it('Ask for top movies by a actor', function (done) {
        this.timeout(20000);
        alexa.spoken('find movies by {will smith}', function (error, response) {
            alexa.spoken('yes', function () {
                done();
            })
        });
    });

    it('Ask for top movies by a actor no actor detail', function (done) {
        this.timeout(20000);
        alexa.spoken('find movies by {}', function (error, response) {
            done();
        });
    });

})

