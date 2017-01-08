module.exports = function(app)
{
    app.intent("start",
            {
                "slots": { "number": "NUMBER" },
                "utterances": ["say the number {1-5|number}"]
            },
            function(request, response) {
                var number = request.slot("number");
                response.say("You asked for the number " + number);
                response.shouldEndSession(false);
            }
            );

    app.intent("end", 
            {
                "slots": { },
                "utterances": ["{Goodbye|Thanks} Alexa {|I feel much better now}"]
            },
            function(request, response) {
                console.log ( "SessionEnd Intent." );
                response.say ( "Have a nice day!" );
                response.shouldEndSession(true);
            }
            );

    app.intent("freeForm", {
      "slots": { "freeform_text": "Amazon.LITERAL" },
      "utterances": ["{-|freeform_text}"]
    }, parseHelpWrapper);

    app.intent("AMAZON.HelpIntent", parseHelpWrapper);

    app.intent ( "AMAZON.StopIntent", function ( request, response )
            {
                console.log ( "Stop intent" );
                response.say ( "Ok. Take care. I will go now" );
            }
            );
}


function parseHelpWrapper (request, response) {
    console.log(request.slot("freeform_text"));
    console.log ( "Parsing freefrom input" );
    response.say ( "I see. Please tell me more" );
    response.shouldEndSession(false);
}
