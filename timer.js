var Timer = new function () {
	var self = this;
	self.callback = {};
	self.tick = function () {
		//So you know I am working.
		console.log("tick");
		self.callback();
		setTimeout(Timer.tick, 1000);
	}
	self.start = function (callback) {
		self.callback = callback;
		self.tick();
	}
};