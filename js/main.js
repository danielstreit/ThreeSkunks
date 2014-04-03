
var choosenDoor,
	removedDoor,
	otherDoor,
	winningDoor,
	$choosenDoor,
	$removedDoor,
	$otherDoor,
	$text,
	$doorContainer,
	$finalScreen,
	round1 = true,
	winner = false,
	goodStrategy = false,
	strategyPage = false;

/*
*	Picks a door randomly to be the winningDoor
*
*/
function chooseWinner() {

	switch (Math.ceil(Math.random()*3)) {
		case 1:
			winningDoor = "one";
			break;
		case 2:
			winningDoor = "two";
			break;
		case 3:
			winningDoor = "three";
			break;
		default:
			winningDoor = 0;
			console.log("error setting winningDoor value");
	}
}

/*
*	Handles round 1 door selection
*	
*	Called when a selectable door is clicked during round 2
*/
function firstSelection(event) {

	// Initialize variables
	round1 = false;
	$choosenDoor = getDoor(event);
	choosenDoor = $choosenDoor.data("door");

	// Update DOM to reflect selection
	$(".selectable").removeClass("selectable");
	$choosenDoor.addClass("selected");

	// Advance game to round 2 state
	$choosenDoor.effect("pulsate", removeDoor);
	$text.fadeOut(400, hideR1showR2);
}

/*
*	Hides round 1 text and shows round 2 text
*	
*	Called by firstSelection fadeOut callback
*/
function hideR1showR2() {

	// Set DOM selection variables based on state of the page
	var r1, r2;
	if (strategyPage) {
		r1 = ".strategyR1";
		r2 = ".strategyR2";
	} else {
		r1 = ".round1";
		r2 = ".round2";
	}

	$text.detach();
	$text.find(r1).addClass("hidden"); // Hide round 1 text
	$text.find(r2).removeClass("hidden"); // Show round 2 text

	// Insert door variables into text
	$text.find(".choosenDoor").append(choosenDoor);
	$text.find(".removedDoor").append(removedDoor);
	$text.find(".otherDoor").append(otherDoor);

	// Reattach and fade in
	$text.appendTo("body");
	$text.fadeIn();
}

/*
*	Removes a door option according to the rules of the game
*	
*	Called by firstSelection choosenDoor effect callback
*/
function removeDoor() {

	// Create an array of all doors and remove the choosen and the winner
	var target = ["one", "two", "three"].filter(function(el) {
		return el != choosenDoor && el != winningDoor;
	});

	// If there are two doors left after the filter, remove one at random
	if (target.length > 1)
		if (Math.random() < .5)
			otherDoor = target.pop();
		else
			otherDoor = target.shift();

	// If only one door remains, its the winner
	// Set other door option to winningDoor
	else
		otherDoor = winningDoor;
	
	// Initialize variables
	$otherDoor = $("." + otherDoor);
	$removedDoor = $("." + target[0]);
	removedDoor = target[0];

	var delay = 400;
	if (strategyPage) {
		// Update odds display
		$removedDoor.find("span").empty();
		$removedDoor.find("span").append("0/3");
		$otherDoor.find("span").empty();
		$otherDoor.find("span").append("2/3");
		delay = 2000;

	} else {
		// Add selectable classes
		$choosenDoor.addClass("selectable");
		$otherDoor.addClass("selectable");
	}

	// X out removedDoor
	$removedDoor.find("img").fadeIn(delay);
}

/*
*	Handles round 2 door selection
*	
*	Called when a selectable door is clicked during round 2
*/
function secondSelection(event) {

	$(".selectable").removeClass("selectable");

	// Update jQuery choosen door to be door selected in round 2
	$choosenDoor = getDoor(event);

	// Set goodStrategy flag
	// If the same door was picked as in round 1
	if (choosenDoor == $choosenDoor.data("door")){
		goodStrategy = false;

	// Else player switched, update variables and DOM accordingly
	} else {
		goodStrategy = true;
		choosenDoor = $choosenDoor.data("door")
		$(".selected").removeClass("selected");
		$choosenDoor.addClass("selected");
	}

	// Set winner flag
	winner = choosenDoor == winningDoor;

	// Advance game to final state
	$choosenDoor.effect("pulsate", finalScreen);
}

/*
*	Initializes and shows the final screen of the game
*	
*	Called after round 2 selection in choosenDoor effect callback
*/
function finalScreen() {
	$finalScreen.detach();

	// Update DOM to unhide appropriate text based on game state
	if (winner) {
		$finalScreen.find(".win").removeClass("hidden");
		$finalScreen.find(".win").find("img").show();

		if (goodStrategy)
			$finalScreen.find(".win").find(".goodStrat").removeClass("hidden");
		else
			$finalScreen.find(".win").find(".badStrat").removeClass("hidden");

	} else {
		$finalScreen.find(".loss").removeClass("hidden");
		$finalScreen.find(".loss").find("img").show();

		if (goodStrategy)
			$finalScreen.find(".loss").find(".goodStrat").removeClass("hidden");
		else
			$finalScreen.find(".loss").find(".badStrat").removeClass("hidden");
	}

	$("body").animate({ backgroundColor: "white" }, 400);
	$(".text,.doorContainer").effect("puff", "slow", function() {

		// Reattach finalScreen and animate!
		$finalScreen.removeClass("hidden");
		$finalScreen.insertAfter($("header"));
		$finalScreen.show("scale", "slow", function() {
			$(".ui-effects-wrapper").remove();
		});
	});
}

/*
*	Initializes strategy section (with some helper functions)
*	
*	Called when strategy link is clicked
*/
function initStrategyPage() {
	strategyPage = true;
	resetPage();
	showStrategyPage();
}

/*
*	Readies DOM for strategy section (not a full reset)
*	
*	Called by initStrategyPage
*/
function resetPage() {

	$finalScreen.effect("scale", "slow");
	$(".ui-effects-wrapper").remove();
	$removedDoor.find("img").hide();
	$choosenDoor.removeClass("selected");
	$(".door").addClass("selectable");
	$(".text .round2").hide();
	$("body").removeAttr('style');
	round1 = true;
}

/*
*	Shows strategy page
*	
*	Called by initStrategyPage
*/
function showStrategyPage() {

	// Apply strategy styles
	$("body").addClass("strategy");
	$("header").addClass("strategy");
	$(".door").addClass("strategy");

	$(".door span").empty();
	$(".door span").append("1/3");
	$("header h1").append("<em> Strategy</em>");

	$("div.strategy").removeClass("hidden");
	$text.fadeIn();
	$doorContainer.fadeIn();
}

/*
*	Returns a jQuery wrapped door object even another element within
*	the door is clicked
*	
*/
function getDoor(event) {
	return $(event.target).is(".door") ? $(event.target) : $(event.target).parent();
}

/*
*	Initializes game variables and listens for events
*	
*	Called when DOM is ready
*/
$(function() {

	// Initialize variables
	chooseWinner();
	$text = $('.text');
	$finalScreen = $(".final");
	$doorContainer = $(".doorContainer");

	// Listen for a click on a selectable door
	$("body").on("click", ".selectable", function(event) {

		if (round1) {
			firstSelection(event);
		} else {
			secondSelection(event);
		}
	});

	// Listen for a click on the strategy link
	$("body").on("click", "a.strategy", function(event) {
		initStrategyPage();
	});


});