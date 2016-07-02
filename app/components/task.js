////////////////////////////////////////////////////////////////////////////////
// INITIALIZE EXPERIMENT VARIABLES /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// define window dimensions for location later in experiment
var window_height;
var window_width;

var testString = "CHECK ONE TWO";   //string for microphone test
var testPass = false;   //for microphone test conditionals

var micTestTime = 10;
var recordTime = 3; //our arbitrary listening timeout length (in seconds)
var stimonTime = 3;

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
	// 	text: "<div class='instructions'><p> First, let's check to see if your microphone is working. </p><p> Please say <strong>'"
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

	var instructions = {
		type: "text",
		text: "<div class='instructions'>" +
		"<p>Repeat each word when you see the microphone.</p>" +
		"<p>Press a key to start.</p></div>"
	};
	timeline.push(instructions);

	//create trials
	for(var itrial = 0; itrial < stim_array.length; itrial++){

		data.listWords.push(stim_array[itrial].text);
		var stim = stimHTMLFormatter(stim_array[itrial]);
		var trial = {
			type: 'single-stim',
			stimulus: stim,
			is_html: true,
			choices: 'none',
			timing_response: stimonTime * 1000
		}
		timeline.push(trial);

		var recitation = {
			type: 'call-function',
			func: function() {ListenUp()},
			timing_post_trial: (recordTime) * 1000,
			on_finish: function() {
				console.log('Listening...')

			}
		};
		timeline.push(recitation);

		// this removes the first stimulus in the stim_array every time through the loop
		// stim_array.shift();
	};

	//run the timeline
	jsPsych.init({
		timeline: timeline,
		on_finish: function() {
			console.log(data)
			var csv_data = CSV([data]);
			console.log(csv_data)
			document.write(csv_data);
			// var encodedUri = encodeURI(csv_data);
			// var link = document.createElement("a");
			// link.setAttribute("href", csv_data);
			// link.setAttribute("download", "my_data.csv");
			// document.body.appendChild(link); // Required for FF
			// link.click(); // This will download the data file named "my_data.csv".
		}
	});
};
