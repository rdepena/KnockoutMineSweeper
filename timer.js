var Timer = function () {
	var self = this;
	var	seconds = 0;
	var	minutes = 0;
	tick = function () {
		if(self.stopTimer) {
			self.stopTimer = null;
			return;
		}
		seconds = (seconds + 1) % 60;
		if(seconds === 0) {
			minutes = (minutes + 1) % 60;
		}
		self.callback({seconds:seconds, minutes:minutes});
		setTimeout(tick, 1000);
	}
	start = function (callback) {
		self.callback = callback;
		tick();
	}
	stop = function () {
		self.stopTimer = true;
	}
	return { 
		tick : tick, 
		start : start,
		stop : stop
	};
};