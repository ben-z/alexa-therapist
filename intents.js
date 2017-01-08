module.exports = function(app) {
    app.intent("start", {
        "slots": { "number": "NUMBER" },
        "utterances": ["say the number {1-5|number}"]
    },
        function(request, response) {
            var number = request.slot("number");
            response.say("You asked for the number " + number);
            response.shouldEndSession(false);
        }
    );

    app.intent("parse",function(request, response) {
            console.log ( "Parsing input" );
            response.say ( "I see. Please tell me more" );
            response.shouldEndSession(false);
        }
    );

    app.intent("end", {
        "slots": { },
        "utterances": ["{Goodbye|Thanks} Alexa {|I feel much better now}"]
    },
        function(request, response) {
            console.log ( "SessionEnd Intent." );
            response.say ( "Have a nice day!" );
            response.shouldEndSession(true);
        }
    );
}
