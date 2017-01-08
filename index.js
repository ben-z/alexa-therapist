var alexa = require("alexa-app");
var app = new alexa.app("alexa-therapist");

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
/*
app.intent("start", {
    "slots": { "number": "NUMBER" },
    "utterances": ["say the number {1-100|number}"]
},
    function(request, response) {
        var number = request.slot("number");
        response.say("You asked for the number " + number);
    }
);*/

module.exports = app;
