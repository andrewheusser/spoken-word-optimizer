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
//records recalled words and logs them
ListenUp = function() {
	data.recalledWords.push([])
	var wordIndex = data.recalledWords.length - 1;
	console.log('wordIndex', wordIndex)
	var $mic = $( "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me'></i></p>" )
	$( ".jspsych-display-element" ).append($mic);
	if (annyang) {
		var logWord = function(word) {

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
	// console.log('Block Number: ' + list);
	// console.log('Words: ' + subject_data.data.listWords[list-1]);
	startTimer(recordTime);      //starts counting seconds for timer to be turned off
	setTimeout(function() {
		console.log(data)
	}, recordTime * 1000);
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

// Returns a csv from an array of objects with
// values separated by tabs and rows separated by newlines
function CSV(array) {
	// Use first element to choose the keys and the order
	var keys = Object.keys(array[0]);

	// Build header
	var result = keys.join("\t") + "\n";

	// Add the rows
	array.forEach(function(obj){
		keys.forEach(function(k, ix){
			if (ix) result += "\t";
			result += obj[k];
		});
		result += "\n";
	});

	return result;
}

function downloadCSV(args) {
	var data, filename, link;
	var csv = convertArrayOfObjectsToCSV({
		data: stockData
	});
	if (csv == null) return;

	filename = args.filename || 'export.csv';

	if (!csv.match(/^data:text\/csv/i)) {
		csv = 'data:text/csv;charset=utf-8,' + csv;
	}
	data = encodeURI(csv);

	link = document.createElement('a');
	link.setAttribute('href', data);
	link.setAttribute('download', filename);
	link.click();
}

function convertArrayOfObjectsToCSV(args) {
	var result, ctr, keys, columnDelimiter, lineDelimiter, data;

	data = args.data || null;
	if (data == null || !data.length) {
		return null;
	}

	columnDelimiter = args.columnDelimiter || ',';
	lineDelimiter = args.lineDelimiter || '\n';

	keys = Object.keys(data[0]);

	result = '';
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	data.forEach(function(item) {
		ctr = 0;
		keys.forEach(function(key) {
			if (ctr > 0) result += columnDelimiter;

			result += item[key];
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
}

stockData = [
        {
            Symbol: "AAPL",
            Company: "Apple Inc.",
            Price: 132.54
        },
        {
            Symbol: "INTC",
            Company: "Intel Corporation",
            Price: 33.45
        },
        {
            Symbol: "GOOG",
            Company: "Google Inc",
            Price: 554.52
        },
    ];
