module.exports = function(app) {
  app.intent("end", {
      "slots": {},
      "utterances": ["{Goodbye|Thanks} Alexa {|I feel much better now}"]
    },
    function(request, response) {
      console.log("SessionEnd Intent.");
      response.say("Have a nice day!");
      response.shouldEndSession(true);
    }
  );

  app.intent("freeForm", {
    "slots": {
      "Adjectives": "ADJECTIVES",
      "thePerson": "AMAZON.US_FIRST_NAME"
    },
    "utterances": ["{-|thePerson} {is|are|was|were|am} {-|Adjectives}"]
  }, parseHelpWrapper);

  app.intent("AMAZON.HelpIntent", {
      "slots": {},
      "utterances": ["I have a problem"]
    },
    promptForProblems);

  app.intent("AMAZON.StopIntent", function(request, response) {
    console.log("Stop intent");
    response.say("Ok. Take care. I will go now");
  });
}

function parseHelpWrapper(request, response) {
  var thePerson = request.slot("thePerson");
  console.log("freeform_text\nIt's about " + thePerson);
  // do some parsing, to replace below line
  response.say("I see. Tell me more about " +
    ((thePerson == "I") ? "it" : thePerson));
  response.shouldEndSession(false);
}

function promptForProblems(request, response) {
  console.log("Parsing freefrom input");
  response.say("I see. Please tell me more");
  response.shouldEndSession(false);
}