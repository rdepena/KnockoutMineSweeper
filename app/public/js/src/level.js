(function (mineSweeper){
	"use strict";
	
	//difficulty level Object
	mineSweeper.Level = function (options) {

		var my = this;
		options = options || {};
		my.description = options.description;
		my.rows = options.rows;
		my.cols = options.cols;
		my.bombs = options.bombs;
		my.winningCondition = function (openCells) {
			return openCells === (my.rows * my.cols) - my.bombs;
		};

		return my;
	};

}(this.mineSweeper = this.mineSweeper || {}));
