//difficulty level Object
mineSweeper.Level = function(options) {
	var self = this;
	options = options || {};
	self.description = options.description;
	self.rows = options.rows;
	self.cols = options.cols;	
	self.bombs = options.bombs;
	self.winningCondition = function (openCells) {
		return openCells === (self.rows * self.cols) - self.bombs;
	};
	
	return self;
}