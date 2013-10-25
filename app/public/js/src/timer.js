(function (mineSweeper) {
	"use strict";
	mineSweeper.Timer = function () {
		var self = this;
		var	seconds = 0;
		var	minutes = 0;

		var tick = function () {
			if(self.stopTimer) {
				return;
			}
			seconds = (seconds + 1) % 60;
			if(seconds === 0) {
				minutes = (minutes + 1) % 60;
			}
			self.callback({seconds:seconds, minutes:minutes});
			setTimeout(tick, 1000);
		};

		var start = function (callback) {
			self.stopTimer = false;
			self.callback = callback;
			tick();
		};

		var stop = function () {
			self.stopTimer = true;
		};

		return { 
			tick : tick, 
			start : start,
			stop : stop
		};
	};

} (this.mineSweeper = this.mineSweeper || {}));