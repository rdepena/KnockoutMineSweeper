(function (mineSweeper) {
	"use strict";
	mineSweeper.Timer = function () {
		var my = this;
		var timerRunning = false;
		var timeInSeconds = 0;

		var tick = function () {
			if(!timerRunning) {
				return;
			}
			timeInSeconds++;
			my.callback({seconds:(timeInSeconds % 60), 
				minutes:Math.floor(timeInSeconds / 60)});
			setTimeout(tick, 1000);
		};

		var start = function (callback) {
			timeInSeconds = 0;
			my.callback = callback;
			if(!timerRunning) {
				timerRunning = true;
				tick();
			}
		};

		var stop = function () {
			timeInSeconds = 0;
			timerRunning = false;
		};

		return { 
			tick : tick, 
			start : start,
			stop : stop
		};
	};

} (this.mineSweeper = this.mineSweeper || {}));