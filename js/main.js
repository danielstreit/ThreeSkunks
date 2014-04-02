
var choosen = "", 
	win = 0,
	removed = "",
	round2Option = ".",
	door,
	text,
	round1 = true;
	winner = false,
	strategy = false;


function chooseWinner() {

	switch (Math.ceil(Math.random()*3)) {
		case 1:
			win = "one";
			break;
		case 2:
			win = "two";
			break;
		case 3:
			win = "three";
			break;
		default:
			win = 0;
			console.log("error setting win value");
	}
}

function firstSelection(event) {
	round1 = false;
	door = $(event.target);
	choosen = door.data("door");
	$(".selectable").removeClass("selectable");
	door.addClass("selected");
	door.effect("pulsate", removeDoor);

	text.fadeOut(400, setRound2Text)

}

function setRound2Text() {
	text.detach();

	text.find(".round1").addClass("hidden");

	text.find(".round2").removeClass("hidden");
	text.find(".round2").find(".choosen").append(choosen);

	text.appendTo("body");
	text.fadeIn();

}

function removeDoor() {
	// Create an array of all doors and remove the choosen and the winner
	var target = ["one", "two", "three"].filter(function(el) {
		return el != choosen && el != win;
	});

	// If there are two doors left after the filter, remove one at random
	if (target.length > 1)
		if (Math.random() < .5)
			round2Option += target.pop();
		else
			round2Option += target.shift();
	else
		round2Option += win;

	// Remove the target door
	removed = target[0];
	$("." + removed + " img").fadeIn();

	// Add selectable classes
	door.addClass("selectable");
	$(round2Option).addClass("selectable");
}

function secondSelection(event) {
	$(".selectable").removeClass("selectable");
	door = $(event.target);
	if (choosen == door.data("door")){
		strategy = false;
	} else {
		strategy = true;
		choosen = door.data("door")
		$(".selected").removeClass("selected");
		door.addClass("selected");
	}

	winner = choosen == win;
	door.effect("pulsate", finalMessage);

}

function finalMessage() {

	// text.fadeOut();
	// $("body").css("background-color", "white");


	if (winner) {
		$(".final").find(".win").removeClass("hidden");
		$(".final").find(".win").find("img").show();
		if (strategy)
			$(".final").find(".win").find(".goodStrat").removeClass("hidden");
		else
			$(".final").find(".win").find(".badStrat").removeClass("hidden");
	} else {
		$(".final").find(".loss").removeClass("hidden");
		$(".final").find(".loss").find("img").show();
		if (strategy)
			$(".final").find(".loss").find(".goodStrat").removeClass("hidden");
		else
			$(".final").find(".loss").find(".badStrat").removeClass("hidden");
	}

	$(".final").removeClass("hidden");
	$("body").animate({ backgroundColor: "white" }, 1000);
	$(".final").fadeIn(1000);
}

$(function() {

	chooseWinner();
	text = $('.text');


	$("body").on("click", ".selectable", function(event) {
		if (round1) {
			firstSelection(event);
		} else {
			secondSelection(event);
		}
	});





});