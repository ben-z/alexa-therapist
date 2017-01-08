function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
      "Adjective": "ADJECTIVE",
      "thePerson": "AMAZON.US_FIRST_NAME"
    },
    "utterances": ["{-|thePerson} {is|are|was|were|am} {-|Adjective}"]
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

function substituteTemplate(templString, dict) {
  let newString = templString;
  for (let varname in dict) {
    if(!dict.hasOwnProperty(varname)) continue;
    console.log(`Replacing ${varname} with ${dict[varname]}`)
    newString = newString.replace(`{${varname}}`, dict[varname]);
  }
  return newString;
}

function generateTellMeMore(subject, adjective) {
  const tellMeMoreITemplates = [
    'I see. Tell me more about it',
    'Can you tell me more? What made you {adjective}?'
  ];

  const tellMeMoreThirdPersonTemplates = [
    'I see. Tell me more about {objectified_subject}.',
    'Can you tell me more about {objectified_subject}?',
    'How {adjective} was {subjectified_subject}? Can you elaborate on that?'
  ];

  const tellMeMoreTemplates = (subject === 'I') ? tellMeMoreITemplates : tellMeMoreThirdPersonTemplates;

  objectified_subject = subject.replace(/\bmy\b/ig, 'your').replace(/\bhe\b/ig, 'him').replace(/\bshe\b/ig, 'her').replace(/\bthey\b/ig, 'them');
  subjectified_subject = subject.replace(/\bmy\b/ig, 'your').replace(/\bhe\b/ig, 'him').replace(/\bshe\b/ig, 'her').replace(/\bthey\b/ig, 'them');

  return substituteTemplate(tellMeMoreTemplates[getRandomInt ( 0, tellMeMoreTemplates.length-1 )], { objectified_subject, subjectified_subject, adjective });
}

function parseHelpWrapper(request, response) {
  var thePerson = request.slot("thePerson");
  var adjective = request.slot("Adjective");
  console.log("freeform_text\nIt's about " + thePerson);
  // do some parsing, to replace below line
  response.say(generateTellMeMore(thePerson, adjective));
  response.shouldEndSession(false);
}

function promptForProblems(request, response) {
  console.log("Parsing freefrom input");
  response.say("I see. Please tell me more");
  response.shouldEndSession(false);
}
