module.exports = function(app)
{
    app.intent("CustomStopIntent", 
            {
                "slots": { },
                "utterances": 
                    ["{Goodbye|Thanks} Alexa {|I feel much better now}",
                     "{Goodbye|Thanks} Alexa {|I feel a lot better now}",
                     "{Okay|I see} I will talk to {somebody|someone}",
                     "I don't want to talk about it",
                     "I don't want to talk",
                     "I am good now",
                     "Let's {stop|finish}",
                     "Let's talk later",
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

    app.intent ( "WantToTalkIntent",
            {
                "slots": {
                },
                "utterances": [ "I want to talk {|to you}", "Let's talk" ]
            },
            parseEmotion );

    app.intent ("DesperateIntent",
            {
                "slots": { },
                "utterances":
                    [ "I want to {hurt|kill} myself",
                      "My life feels so worthless",
                      "I {want to| am considering to} {hurt myself|kill myself|suicide}",
                      "{|Honestly} I want to die",
                      "I don't want to live {at all|anymore}",
                      "Life is not worth living",
		      "I feel worthless"
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
                    "I'm {|feeling} {-|Adjective}",
                    "I {called|calls|keeps calling} me names. and it makes me {-|Adjective}",
                    "{-|thePerson} {feel|cannot help feeling|can't help feeling} {-|Adjective}",
                    "{-|thePerson} {am|am feeling} {-|Adjective}",
                    "{-|thePerson} {called|calls|keeps calling} me names. and it makes me {-|Adjective}",
                    "{-|Adjective} is all {I am feeling|I'm feeling|I feel}",
                    "There {is not|isn't} much I can do about being {-|Adjective}",
                    "{-|thePerson} is {is|are|was|were|am} {-|Adjective}",
                    "{-|thePerson} {abuses|abuse|is abusing} {|me}",
                    "I {hate|don't like} {-|Activity}",
                    "{-|Activity} is {-|Adjective}",
                    "I {am worried about|keep worrying about} {thePerson}",
                    "I {am worried about|keep worrying about} {Activity}",
                ]
            },
            parseEmotion);

    
    app.intent("AMAZON.HelpIntent",
            {"slots":{},
             "utterances": ["I have a problem"] },
            promptForProblems);

    app.intent("freeForm", parseEmotion  );

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

function generatePositiveEncouragement (session) {
    const responses = [
        "Try talking to people who you trust in, like me. Except that I'm not a real person.",
        "A ship is safe in harbor, but that's not what ships are for.",
        "Not all those who wander are lost.",
        "Worrying is like paying interest on a debt you may never owe.",
	"The reason we struggle with insecurity is because we compare our behind-the-scenes with everyone else’s highlight reel.",
	"look on the brighter side of things."
    ];
    return responses[getRandomInt (0, responses.length-1, session)];
}

function positiveEncouragement ( request, response ) {
    response.say ( generatePositiveEncouragement(request.getSession()) );
}

function substituteTemplate(templString = "", dict) {
  let newString = templString;
  for (let varname in dict) {
    if(!dict.hasOwnProperty(varname) || !dict[varname]) continue;
    console.log(`Replacing ${varname} with ${dict[varname]}`)
    newString = newString.replace(`{${varname}}`, dict[varname]);
  }
  return newString;
}

function generateTellMeMore(session, subject, adjective) {
    const tellMeMoreGenericTemplates = [ 
        'Tell me more about it',
        "I'm listening",
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
  let objectified_subject = subject ? subject.replace(/\bmy\b/ig, 'your').replace(/\bhe\b/ig, 'him').replace(/\bshe\b/ig, 'her').replace(/\bthey\b/ig, 'them') : null;
  let subjectified_subject = subject ? subject.replace(/\bmy\b/ig, 'your').replace(/\bhim\b/ig, 'he').replace(/\bher\b/ig, 'she').replace(/\bthem\b/ig, 'they') : null;

  console.log('subject', subject);

  return substituteTemplate(tellMeMoreTemplates[getRandomInt ( 0, tellMeMoreTemplates.length-1, session)], { objectified_subject, subjectified_subject, adjective });
}


function parseEmotion ( request, response ) {
    var emotion = request.slot ( "Adjective" );
    var thePerson = request.slot ( "thePerson" );
    var activity = request.slot ("Activity" );
    console.log ( "Parsing emotion: " + emotion );
    //if ( thePerson )
        //console.log ( "It's about " + thePerson );
    if ( emotion ) {
        response.say(generateTellMeMore(  request.getSession(), thePerson || activity || 'I', emotion));
    }
    else {
        // if there's not emotion, 50/50
        var temp = getRandomInt ( 0, 1, request.getSession() );
        if (temp === 0)
            response.say(generateTellMeMore(request.getSession()));
        else
            positiveEncouragement ( request, response );
    }
    response.shouldEndSession(false);
}

function getRandomInt(min, max, session) {
	let randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    while (session.get('last_random_number') == randNum) {
        randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    }
	session.set('last_random_number', randNum);

    return randNum;
}

function generateResponeToDesperate (session) {
    const response = [
        "Remember that there’s always somebody who cares about you. If you trust me, tell me more.",
        "That's what I'm here for. What's on your mind?"
    ];
    return response[getRandomInt (0, response.length-1, session)];
}

function desperateWrapper ( request, response ) {
    response.say ( generateResponeToDesperate (request.getSession()) );
    response.shouldEndSession ( false );
}

function promptForProblems (request, response) {
    console.log ( "Parsing freefrom input" );
    response.say ( "I see. Please tell me more" );
    response.shouldEndSession(false);
}
