var prepareTrials = function(data){
	return new Promise(
		function(resolve,reject){

			// the first element is a header, not data so let's get rid of it.
			data.shift()

			// shuffle the trials
			var shuffled_data = jsPsych.randomization.shuffle(data);

			for (var itrial = 0; itrial < data.length; itrial++) {

				var item = shuffled_data[0]; //first row in data

				//elements of the first row of data
				var word = item[0];
				var length = item[1];
				var size = item[2];
				var category = item[3];

				//create a stimulus for each element of the data and push it to the stim_array
				var stim = {
					type: "p",
					text: word, //inserts the word from each row of csv file
					Length: length,
					size: size,
					category: category
				};

				//relative positioning specific to 5vw courier
				var height_range = Math.random() * 85;
				var width_range = Math.random() * (100 - stim.Length * 3);

				// set color of the word
				var r = Math.floor(Math.random() * 255);
				var g = Math.floor(Math.random() * 255);
				var b = Math.floor(Math.random() * 255);

				stim.style = [
					"color:rgb(" + r + ',' + g + ',' + b + ')',
					"font-size:5vw",
					"font-family:courier",          // uses randomly assigned rgb, x, and y values
					"position:absolute",
					"top:" + height_range + "%",      // relative positioning
					"left:" + width_range + "%"
				];

				stim_array.push(stim)
				shuffled_data.shift();
			}
		resolve(stim_array)
	})
};
