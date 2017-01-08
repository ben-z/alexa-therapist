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
    response.say( getStartPrompt() );
});

populateIntents(app);

module.exports = app;
