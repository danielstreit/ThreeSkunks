
var choosen = "", 
	win = 0,
	removed = "",
	round2Option = ".",
	door,
	otherDoor = "",
	text,
	round1 = true;
	winner = false,
	goodStrategy = false
	strategyPage = false;


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
	door.removeClass("selectable");
	$(".selectable").removeClass("selectable");
	door.addClass("selected");
	door.effect("pulsate", removeDoor);

	if (strategyPage) {
		text.fadeOut(400, strategyR2Text);
	} else {
		text.fadeOut(400, setRound2Text);
	}
}

function setRound2Text() {
	text.detach();

	text.find(".round1").addClass("hidden");

	text.find(".round2").removeClass("hidden");
	text.find(".round2").find(".choosen").append(choosen);

	text.appendTo("body");
	text.fadeIn();

}

function strategyR2Text() {
	text.detach();
	text.find(".strategyR1").addClass("hidden");
	text.find(".strategyR2").removeClass("hidden");
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
	otherDoor = round2Option.slice(1);
	round2Option = $(round2Option);

	removed = $("." + target[0])
	if (strategyPage) {
		removed.empty();
		removed.append("0/3");
		round2Option.empty();
		round2Option.append("2/3");

	} else {
		// Remove the target door
		removed.find("img").fadeIn();

		// Add selectable classes
		door.addClass("selectable");
		round2Option.addClass("selectable");
	}
	removed = target[0];
}

function secondSelection(event) {
	$(".selectable").removeClass("selectable");
	door = $(event.target);
	if (choosen == door.data("door")){
		goodStrategy = false;
	} else {
		goodStrategy = true;
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
		if (goodStrategy)
			$(".final").find(".win").find(".goodStrat").removeClass("hidden");
		else
			$(".final").find(".win").find(".badStrat").removeClass("hidden");
	} else {
		$(".final").find(".loss").removeClass("hidden");
		$(".final").find(".loss").find("img").show();
		if (goodStrategy)
			$(".final").find(".loss").find(".goodStrat").removeClass("hidden");
		else
			$(".final").find(".loss").find(".badStrat").removeClass("hidden");
	}

	$(".final").removeClass("hidden");
	$("body").animate({ backgroundColor: "white" }, 2000);
	$(".final").fadeIn(2000);
}

function openStratPage() {
	resetPage();
	applyStrategyStyles();

	$("div.strategy").removeClass("hidden");
}

function resetPage() {
	$(".final").hide();
	$(".door img").hide();
	$(".door").addClass("selectable");
	door.removeClass("selected");
	$(".text .round2").hide();
	$("body").removeAttr('style');
	round1 = true;
	round2Option = "."
	// $("body").css("background-color","hsla(230, 30%, 90%, 1)");
}

function applyStrategyStyles() {
	$("body").addClass("strategy");
	$(".header").addClass("strategy");
	$(".door").addClass("strategy");
	$(".door").empty();
	$(".door").append("1/3");
	$(".header").append("<em> Strategy</em>")
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


	$("body").on("click", "a.strategy", function(event) {
		strategyPage = true;
		openStratPage();
	});


});