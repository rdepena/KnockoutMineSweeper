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
	self.display = ko.computed(function () {
		var displayValue = "";
		if (self.open()) {
			if (self.isBomb()) {
				displayValue = "b";
			} else {
				displayValue = self.numberOfBombs() !== 0 ? self.numberOfBombs() : "";
			}
		}
		return displayValue;
	});
}