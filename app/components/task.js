////////////////////////////////////////////////////////////////////////////////
// INITIALIZE EXPERIMENT VARIABLES /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// define window dimensions for location later in experiment
var window_height;
var window_width;

// var listLength = 3; // how long you want each list to be
// var numberOfLists = 10;  // number of study/test blocks

var testString = "CHECK ONE TWO";   //string for microphone test
var testPass = false;   //for microphone test conditionals

var wordsCorrect;   //number of matched words for each trial
var recordTime = 3; //our arbitrary listening timeout length (in seconds)

var stim_array = [];  //create an array for stimuli
var timeline = [];    //create the jsPsych timeline variable
var data = {          //data object to keep track of recalled words
	listWords : [],
	recalledWords : [],
};

////////////////////////////////////////////////////////////////////////////////
// CREATE THE TIMELINE /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var runExperiment = function(stim_array){

	// var micInstructions = {
	// 	type: 'text',
	// 	text: "<div class='instructions'><p>Welcome to the experiment!</p><p> First, let's check to see if your microphone is working. </p><p> Please say <strong>'"
	// 	+ testString + "'</strong> when you see the <i style='color:red' class='fa fa-microphone'></i>.</p><p>Press any key to do the test.</p></div>",
	// 	is_html: true
	// }
	// timeline.push(micInstructions);
	//
	// var micTest = {
	// 	type: 'call-function',
	// 	func: testMic,
	// 	timing_post_trial: 10000,
	// };
	// timeline.push(micTest);
	//
	// var fail = {
	// 	type: 'text',
	// 	text: "<div class='instructions'><p>The test didn't work...</p><p>Please say <strong>'" + testString + "'</strong> clearly and close to the microphone.</p>" +
	// 	"<p>Press any key to try again.</p></div>",
	// 	is_html: true,
	// 	on_finish: function() {
	// 		if(annyang) {
	// 			annyang.abort();
	// 		}
	// 	}
	// }
	//
	// var fail_loop = {
	// 	timeline:[fail, micTest],
	// 	loop_function: function() {
	// 		if (testPass === false) {
	// 			return true;
	// 		} else if (testPass === true) {
	// 			return false;
	// 		}
	// 	}
	// };
	//
	// var if_failed = {
	// 	timeline: [fail_loop],
	// 	conditional_function: function() {
	// 		if (testPass === false) {
	// 			return true;
	// 		} else if (testPass === true) {
	// 			return false;
	// 		}
	// 	}
	// };
	// timeline.push(if_failed);
	//
	// var instructions = {
	// 	type: "text",
	// 	text: "<div class='instructions'>" +
	// 	"<p>Let's try a quick practice round.  In this practice list, you will see three words, one at a time.</p>" +
	// 	"<p>Then, when you see the <i style='color:red' class='fa fa-microphone'></i>, try to recall as many words as you can.</p>" +
	// 	"<p>Please speak <strong>slowly</strong> and <strong>clearly</strong> close to your computer.</p></div>"
	// };
	// timeline.push(instructions);

	//create trials
	for(var itrial = 0; itrial < stim_array.length; itrial++){

		var stim = stimHTMLFormatter(stim_array[itrial]);
		var trial = {
			type: 'single-stim',
			stimulus: stim,
			is_html: true,
			choices: 'none',
			timing_response: 3000,
		}
		timeline.push(trial);

		data.listWords.push(stim_array[0].text);

		var recitation = {
			type: 'call-function',
			func: function() {ListenUp()},
			timing_post_trial: (recordTime) * 1000,
			on_finish: function() {
				console.log('Saving data...')

			}
		};
		timeline.push(recitation);

		// this removes the first stimulus in the stim_array every time through the loop
		stim_array.shift();
	};

	//run the timeline
	jsPsych.init({
		timeline: timeline,
		on_finish: function() {
		}
	});

};

////////////////////////////////////////////////////////////////////////////////
// LOAD DATA, PREPARE STIM AND THEN RUN THE EXPERIMENT /////////////////////////
////////////////////////////////////////////////////////////////////////////////

// load the data, and once the data is loaded, prepare the stimuli and run the study!
// loadData.then(function(loadedFileData){
// 	prepareTrials(loadedFileData).then(function(trials){
// 	})
// });



////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// create a function to show a plus sign at the beginning of recording
var testMic = function() {
	var $mic = $( "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me'></i></p>" )
	$( ".jspsych-display-element" ).append($mic);
	if (annyang) {
		var test = function(check) {
			var capTest = check.toUpperCase();
			console.log('Checked ' + capTest + '.');
			var testVal = capTest.localeCompare(testString);
			if (testVal === 0) {
				testPass = true;
				console.log('test passed');
				$( ".mic" ).remove();
				var $micSuccessMessage = $( "<p id='mic-success-message' class='instructions'>That's it! Your microphone works. Let's move on.</p>" )
				$( ".jspsych-display-element" ).append($micSuccessMessage);
				annyang.abort();
				return testPass
			} else {
				testPass = false;
				return testPass
			}
		}
	}
	var abort = function() {
		annyang.abort();
	};
	// Define commands
	var commandsTest = {
		'*check': test,
		'turn off mic(rophone)': abort
	};

	annyang.debug(); // Debug info for the console
	annyang.addCommands(commandsTest); // Initialize annyang with our commands
	annyang.start();
	console.log('Microphone turned on.');
	startTimer();
};


//create a formatter to make each item in stim_array a jsPsych block
var stimHTMLFormatter = function(stimulus){
	var tag1 = "<" + stimulus.type + " style= '" + stimulus.style.join('; ') + "'>"
	var tag2 = "</" + stimulus.type + ">"
	return tag1 + stimulus.text + tag2
};

//records recalled words and logs them
ListenUp = function() {
	var $mic = $( "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me'></i></p>" )
	$( ".jspsych-display-element" ).append($mic);
	data.recalledWords.push([]) // creates an empty array for the next list
	if (annyang) {
		var logWord = function(word) {
			var listIndex = data.recalledWords.length - 1;
			var splitWord = word.split(" ");
			for (w in splitWord) {
				var capWord = splitWord[w].toUpperCase();
				data.recalledWords[listIndex].push(capWord);
				console.log("Logged " + capWord + ".");
			};
		};

		var abort = function() {
			annyang.abort();
		};
		// Define commands
		var commandsLog = {
			'*input': logWord,
			'turn off mic(rophone)': abort
		};

		annyang.debug(); // Debug info for the console
		annyang.removeCommands();
		annyang.addCommands(commandsLog); // Initialize annyang with our commands
		annyang.start();
	};

	console.log('Microphone turned on.');
	// console.log('Block Number: ' + list);
	// console.log('Words: ' + subject_data.data.listWords[list-1]);
	startTimer();      //starts counting seconds for timer to be turned off
	setTimeout(function() {
		var listIndex = data.recalledWords.length - 1;
		console.log(data)
		correctWords = computeAccuracy(data.listWords[listIndex],data.recalledWords[listIndex]);
		data.correctWords.push(correctWords)
		psiTurk.recordTrialData(data)

	}, recordTime * 1000);
};

// create a timer function that turns off the microphone
var startTimer = function() {
	console.log("timer started")
	setTimeout(function(){
		$( ".mic" ).remove();
		annyang.abort();
		console.log('Microphone turned off.');
	}, recordTime * 1000);
};

//create a function to compare recalled words to the wordlist. Stores and displays results
var computeAccuracy = function(listWords,recalledWords) {
	var correctWords = []
	for(idx1 in recalledWords){
		for(idx2 in listWords){
			if (recalledWords[idx1]===listWords[idx2]){
				correctWords.push(recalledWords[idx1])
			}
		}
	}
	return correctWords
};
