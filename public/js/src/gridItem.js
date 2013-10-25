(function(mineSweeper) {
	"use strict";
	
	//GridItem Object
	mineSweeper.GridItem = function (x, y) {

		var my = this;
		//Data
		my.x = x;
		my.y = y;
		my.isBomb = ko.observable(false);
		my.numberOfBombs = ko.observable(0);
		my.open = ko.observable(false);
		my.displayClass = ko.computed( function () {
			if (my.isBomb() && my.open()) {
				return "topcoat-notification";
			}
			return mineSweeper.numberClasses[my.numberOfBombs()];
		});
		my.display = ko.computed(function () {
			var displayValue = "";
			if (my.open() && !my.isBomb()) {
				displayValue = my.numberOfBombs() !== 0 ? my.numberOfBombs() : "";
			}
			return displayValue;
		});
	};
	//cheap way to do this.
	mineSweeper.numberClasses = ["none","one", "two", "three", "four", "five", "six"];	

}(this.mineSweeper = this.mineSweeper || {}));
