(function (mineSweeper) {
	"use strict";
	mineSweeper.Timer = function () {
		var my = this;
		var	seconds = 0;
		var	minutes = 0;

		var tick = function () {
			if(my.stopTimer) {
				return;
			}
			seconds = (seconds + 1) % 60;
			if(seconds === 0) {
				minutes = (minutes + 1) % 60;
			}
			my.callback({seconds:seconds, minutes:minutes});
			setTimeout(tick, 1000);
		};

		var start = function (callback) {
			my.stopTimer = false;
			my.callback = callback;
			tick();
		};

		var stop = function () {
			my.stopTimer = true;
		};

		return { 
			tick : tick, 
			start : start,
			stop : stop
		};
	};

} (this.mineSweeper = this.mineSweeper || {}));