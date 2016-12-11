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

    xit('test 1', function (done) {
        this.timeout(20000);
        alexa.spoken('find about {lord of the rings}', function (error, response) {
            alexa.spoken('no', function (error, response) {
                alexa.spoken('yes', function (error, response) {
                    alexa.spoken('yes', function (error, response) {
                        alexa.spoken('yes', function (error, response) {
                            done()
                        })
                    })
                })
            })
        });
    });

    xit('test 2', function (done) {
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

    xit('test 2', function (done) {
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

    it('test 2', function (done) {
        this.timeout(20000);
        alexa.spoken('find movies by {will smith}', function (error, response) {
            alexa.spoken('yes', function () {
                done();
            })
        });
    });

})

