module.exports = function(app)
{
    app.intent("CustomStopIntent", 
            {
                "slots": { },
                "utterances": 
                    ["{Goodbye|Thanks} Alexa {|I feel much better now}",
                     "{Goodbye|Thanks} Alexa {|I feel a lot better now}",
                    ]
            }, 
            stopIntent );

    app.intent ("UnwillingIntent",
            {
                "slots": {
                    "Activity": "ACTIVITY",
                },
                "utterances": ["I {don't|do not} want to {-|Activity}"]
            },
            unwillingWrapper );

    app.intent ("DesperateIntent",
            {
                "slots": { },
                "utterances":
                    [ "I want to {hurt|kill} myself",
                      "My life feels so worthless",
                      "I {want to| am considering to} {hurt myself|kill myself|suicide}",
                      "I want to die",
                    ]
            },
            desperateWrapper );
    app.intent ("EmotionIntent",
            {
                "slots": { 
                    "thePerson": "AMAZON.US_FIRST_NAME",
                    "Adjective": "ADJECTIVE",
                    "Activity": "ACTIVITY"
                },
                "utterances":[ 
                    "I {feel|cannot help feeling|can't help feeling} {-|Adjective}",
                    "I {am|am feeling} {-|Adjective}",
                    "I {called|calls|keeps calling} me names. and it makes me {-|Adjective}",
                    "{-|thePerson} {feel|cannot help feeling|can't help feeling} {-|Adjective}",
                    "{-|thePerson} {am|am feeling} {-|Adjective}",
                    "{-|thePerson} {called|calls|keeps calling} me names. and it makes me {-|Adjective}",
                    "{-|Adjective} is all {I am feeling|I'm feeling|I feel}",
                    "There {is not|isn't} much I can do about being {-|Adjective}",
                    "{-|thePerson} is {is|are|was|were|am} {-|Adjective}",
                    "{-|thePerson} {abuses|abuse|is abusing} {|me}",
                    "I {hate|don't like} {-|Activity}",
                    "{-|Activity} is {-|Adjective}"
                ]
            },
            parseEmotion);

    
    app.intent("AMAZON.HelpIntent",
            {"slots":{},
             "utterances": ["I have a problem"] },
            promptForProblems);

    app.intent("freeForm", generateTellMeMore ( )  );

    app.intent ( "AMAZON.StopIntent",stopIntent);
            
}

function unwillingWrapper ( request, response ) {
    var activity = request.slot ( "Activity" );
    console.log ( "Unwilling intent" );
    response.say ( "Why don't you want to " + activity + "?" );
    response.shouldEndSession(false);
}

function stopIntent (request, response) {
    console.log ( "SessionEnd Intent." );
    positiveEncouragement ( request, response );
    response.say ( "Have a nice day!" );
    
    response.shouldEndSession(true);
}

function generatePositiveEncouragement () {
    const responses = [
        "Try talking to people who you trust in, and positive vibes.",
        "You can be the ripest juiciest peach in the world, and there's still going to be somebody who hates peaches.",
        "A ship is safe in harbor, but that's not what ships are for.",
        "Not all those who wander are lost.",
        "If you're going through hell, keep going.",
        "War doesn't decide who's right. War decides who's left.", 
        "How Can Mirrors Be Real If Our Eyes Aren't Real",
        "Worrying is like paying interest on a debt you may never owe",
    ];
    return responses[getRandomInt (0, responses.length-1)];
}

function positiveEncouragement ( request, response ) {
    response.say ( generatePositiveEncouragement() );
}

function substituteTemplate(templString, dict) {
  let newString = templString;
  for (let varname in dict) {
    if(!dict.hasOwnProperty(varname) || !dict[varname]) continue;
    console.log(`Replacing ${varname} with ${dict[varname]}`)
    newString = newString.replace(`{${varname}}`, dict[varname]);
  }
  return newString;
}

function generateTellMeMore(subject, adjective) {
    const tellMeMoreGenericTemplates = [ 
        'I see. Tell me more about it',
        "I'm listening",
        "I'm all ears",
    ];
  const tellMeMoreITemplates = [
    'Can you tell me more? What made you {adjective}?',
    'Why are you {adjective}?',
    'What made you {adjective}?'
  ];

  const tellMeMoreThirdPersonTemplates = [
    'I see. Tell me more about {objectified_subject}.',
    'Can you tell me more about {objectified_subject}?',
    'How {adjective} was {subjectified_subject}? Can you elaborate on that?'
  ];

  const tellMeMoreTemplates = [...tellMeMoreGenericTemplates];
 if ( subject && adjective ) {
    if ( subject === 'I' ) {
        tellMeMoreTemplates.push (... tellMeMoreITemplates );
    }
    else {
        tellMeMoreTemplates.push (... tellMeMoreThirdPersonTemplates );
    }
 } 

  console.log('subject', subject);
  objectified_subject = subject ? subject.replace(/\bmy\b/ig, 'your').replace(/\bhe\b/ig, 'him').replace(/\bshe\b/ig, 'her').replace(/\bthey\b/ig, 'them') : null;
  subjectified_subject = subject ? subject.replace(/\bmy\b/ig, 'your').replace(/\bhim\b/ig, 'he').replace(/\bher\b/ig, 'she').replace(/\bthem\b/ig, 'they') : null;

  return substituteTemplate(tellMeMoreTemplates[getRandomInt ( 0, tellMeMoreTemplates.length-1 )], { objectified_subject, subjectified_subject, adjective });
}


function parseEmotion ( request, response ) {
    var emotion = request.slot ( "Adjective" );
    var thePerson = request.slot ( "thePerson" );
    var activity = request.slot ("Activity" );
    console.log ( "Parsing emotion: " + emotion );
    //if ( thePerson )
        //console.log ( "It's about " + thePerson );
    if ( emotion ) {
        response.say(generateTellMeMore( thePerson || activity || 'I', emotion));
    }
    else 
        positiveEncouragement ( request, response );
    response.shouldEndSession(false);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateResponeToDesperate () {
    const response = [
        "Remember that there’s always somebody who cares about you. If you want to talk to someone more, please contact a hotline. ",
    ];
    return response[getRandomInt (0, response.length-1)];
}
function desperateWrapper ( request, response ) {
    response.say ( generateResponeToDesperate () );
    response.shouldEndSession ( false );
}
function promptForProblems (request, response) {
    console.log ( "Parsing freefrom input" );
    response.say ( "I see. Please tell me more" );
    response.shouldEndSession(false);
}
