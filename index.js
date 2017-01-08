var alexa = require("alexa-app");
var app = new alexa.app("alexa-therapist");
var populateIntents = require("./intents");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Launch Request
function getStartPrompt () {
    var _startPrompts = ["Sure, what's the problem?", "What's up?"];
    return _startPrompts [getRandomInt ( 0, _startPrompts.length )];
}

app.launch(function(request, response) {
    console.log ( "Therapist launched." );
    response.say( getStartPrompt() );
    response.shouldEndSession(false);
});

populateIntents(app);

// Print schema and utterances 
console.log ( "Schema:\n" + app.schema() + "\n\n" );
console.log ( "Utterances:\n" + app.utterances() + "\n\n" );

app.sessionEnded(function(request, response) {
    // cleanup the user's server-side session
    console.log("session ended for user: " + request.userId);
    response.say("session ended for user: " + request.userId);
    // no response required
});

module.exports = app;
