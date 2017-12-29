// generates the random winning number between 1-100
function generateWinningNumber() {
	return Math.floor(Math.random()*100) + 1;
}

//shuffles an array of elements using Fisher-Yates
function shuffle(arr) {
	var l = arr.length, mv, i;

	while(l) {
		//get next random index
		i = Math.floor(Math.random() * l--);

		//move element to end of array
		mv = arr[i];
		arr[i] = arr[l];
		arr[l] = mv;
	}
	return arr
}

//game object
function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	return Math.abs(this.winningNumber - this.playersGuess)
}

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber
}

Game.prototype.playersGuessSubmission = function(guess) {
	if(typeof guess !== "number")
		throw "That is an invalid guess."
	else if(0 >= guess || guess > 100)
		throw "That is an invalid guess."
	else
		this.playersGuess = guess;

	return this.checkGuess()

}

Game.prototype.checkGuess = function(){
		//check the players guess for correctness
	if (this.playersGuess === this.winningNumber) {
		this.pastGuesses.push(this.playersGuess);
		return "You Win!"
	}
	else if(this.pastGuesses.includes(this.playersGuess))
		return "You have already guessed that number."
	else {
		this.pastGuesses.push(this.playersGuess);
		if(this.pastGuesses.length >= 5)
			return "You Lose."
		else if(this.difference() < 10)
			return "You\'re burning up!"
		else if(this.difference() < 25)
			return "You\'re lukewarm."
		else if(this.difference() < 50)
			return "You\'re a bit chilly."
		else if(this.difference() < 100)
			return "You\'re ice cold!"
	}
}

Game.prototype.provideHint = function(){
	var hint = [this.winningNumber,generateWinningNumber(),generateWinningNumber()];
	return shuffle(hint)
}

function newGame() {
	// return Object.create(new Game)
	return new Game
}

function submit(game){
	var output = game.playersGuessSubmission(+$('#player-input').val());
	$('#player-input').val('');
	console.log(output)

	//display output in h1
	$('#title').text(output);

	var guessList = $('#guesses li');

	if(output === 'You have already guessed that number.')
		console.log(output)
	else if(output === "You Win!" || output === "You Lose."){
		
		$('#headers').find('h2').text("Click Reset to Play Again");
		//disable buttons
		$('#submit').attr('disabled',true);
		$('#hint').attr('disabled',true);
		
		$(guessList[game.pastGuesses.length - 1]).text(game.playersGuess);

	} else {
		$(guessList[game.pastGuesses.length - 1]).text(game.playersGuess);
		// console.dir(guessList);
		if(game.isLower())
			$('#headers').find('h2').text('Guess Higher!');
		else
			$('#headers').find('h2').text('Guess Lower!');
	}


}

$(document).ready(function(){
	game = newGame();
	
	$('#submit').on('click',function(){
		submit(game);
	});
	$('#player-input').keypress(function(e) {
		if(e.which == 13)
			submit(game);
	});
	$('#reset').on('click',function(){
		//reset the game
		game = newGame();
		//reset title/headers
		$('#title').text("Guessing Game!");
		$('#headers').find('h2').text("Guess a Number Between 1 - 100");

		// enable submit and hint
		$('#submit').attr('disabled',false);
		$('#hint').attr('disabled',false);
		// restore guess elements
		var guessList = $('#guesses li');
		for (var i = 0; i < guessList.length; i++) {
			$(guessList[i]).text('_');
		};
	});

	$('#hint').on('click',function(){
		$('#title').text(game.provideHint().join('   '));
		$('#hint').attr('disabled',true);
	});
});
