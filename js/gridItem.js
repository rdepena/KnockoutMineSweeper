//GridItem Object
mineSweeper.GridItem = function (x, y) {
	"use strict";
	var self = this;
	//Data
	self.x = x;
	self.y = y;
	self.isBomb = ko.observable(false);
	self.numberOfBombs = ko.observable(0);
	self.open = ko.observable(false);
	self.displayClass = ko.computed( function () {
		if (self.isBomb() && self.open()) {
			return "bomb";
		}
		return mineSweeper.numberClasses[self.numberOfBombs()];
	});
	self.display = ko.computed(function () {
		var displayValue = "";
		if (self.open() && !self.isBomb()) {
			displayValue = self.numberOfBombs() !== 0 ? self.numberOfBombs() : "";
		}
		return displayValue;
	});
}
//cheap way to do this.
mineSweeper.numberClasses = ["none","one", "two", "three", "four", "five", "six"];