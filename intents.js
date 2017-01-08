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
                },
                "utterances":[ 
                    "{-|thePerson} {feel|cannot help feeling|can't help feeling} {-|Adjective}",
                    "{-|thePerson} {am|am feeling} {-|Adjective}",
                    "{-|thePerson} {called|calls|keeps calling} me names. and it makes me {-|Adjective}",
                    "{-|Adjective} is all {I am feeling|I'm feeling|I feel}",
                    "There {is not|isn't} much I can do about being {-|Adjective}",
                    "{-|thePerson} is {is|are|was|were|am} {-|Adjective}",
                    "{-|thePerson} {abuses|abuse|is abusing} {|me}"
                ]
            },
            parseEmotion);

    
    app.intent("AMAZON.HelpIntent",
            {"slots":{},
             "utterances": ["I have a problem"] },
            promptForProblems);

    app.intent("freeForm", positiveEncouragement );

    app.intent ( "AMAZON.StopIntent",stopIntent);
            
}

function unwillingWrapper ( request, response ) {
    var activity = request.slot ( "Activity" );
    console.log ( "Unwilling intent" );
    response.say ( "Why don't you want to " + activity );
    response.shouldEndSession(false);
}

function stopIntent (request, response) {
    console.log ( "SessionEnd Intent." );
    response.say ( "Have a nice day!" );
    positiveEncouragement ( request, response );
    
    response.shouldEndSession(true);
}

function generatePositiveEncouragement () {
    const responses = [
        "Try talking to people who you trust in, and positive vibes.",
        "Please remember when you are scared or frightened. never forget the times when you felt happy. When the day is dark. always remember happy days."
    ];
    return response[getRandomInt (0, response.length-1)];
}
function positiveEncouragement ( request, response ) {
    response.say ( generateResponeToDesperate() );
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
  subjectified_subject = subject.replace(/\bmy\b/ig, 'your').replace(/\bhim\b/ig, 'he').replace(/\bher\b/ig, 'she').replace(/\bthem\b/ig, 'they');

  return substituteTemplate(tellMeMoreTemplates[getRandomInt ( 0, tellMeMoreTemplates.length-1 )], { objectified_subject, subjectified_subject, adjective });
}


function parseEmotion ( request, response ) {
    var emotion = request.slot ( "Adjective" );
    var thePerson = request.slot ( "thePerson" );
    console.log ( "Parsing emotion: " + emotion );
    //if ( thePerson )
        //console.log ( "It's about " + thePerson );
    if ( emotion ) {
        response.say(generateTellMeMore(thePerson, emotion));
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
        "Remember that there’s always somebody who cares about you. If you want to talk to someone more, please contact a suicide hotline. ",
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
