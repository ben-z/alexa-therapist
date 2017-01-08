module.exports = function(app) {
    console.log ( "Inside intents.js");
    app.intent("start", {
        "slots": { "number": "NUMBER" },
        "utterances": ["say the number {1-100|number}"]
    },
        function(request, response) {
            var number = request.slot("number");
            response.say("You asked for the number " + number);
        }
    );
}
