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
	startTimer(micTestTime);
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
			var wordIndex = data.recalledWords.length - 1;
			var splitWord = word.split(" ");
			for (w in splitWord) {
				var capWord = splitWord[w].toUpperCase();
				data.recalledWords[wordIndex].push(capWord);
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
	startTimer(recordTime);      //starts counting seconds for timer to be turned off
};

// create a timer function that turns off the microphone
var startTimer = function(time) {
	console.log("timer started")
	setTimeout(function(){
		$( ".mic" ).remove();
		annyang.abort();
		console.log('Microphone turned off.');
	}, time * 1000);
};
