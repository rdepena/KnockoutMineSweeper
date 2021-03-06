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
;(function (mineSweeper){
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
;(function (mineSweeper) {

	"use strict";
	//Mines using knockout JS
	mineSweeper.MineSweeperViewModel = function () {
		var my = this;
		//Data
		my.activeGame = ko.observable(false);
		my.openNum = ko.observable(0);
		my.grid = ko.observableArray();
		my.bombs = ko.observableArray();
		my.level = ko.observable();
		my.seconds = ko.observable(0);
		my.minutes = ko.observable(0);
		my.timer = mineSweeper.Timer();

		my.timeDisplay = function (t) {
			return t < 9 ? "0" + t : t;
		};

		my.secondsDisplay = ko.computed(function () {
			return my.timeDisplay(my.seconds());
		});
		my.minutesDisplay = ko.computed(function () {
				return my.timeDisplay(my.minutes());
		});

		my.levels = [
			new mineSweeper.Level({
				description : "Easy",
				rows : 9,
				cols : 9,
				bombs : 10
			}),
			new mineSweeper.Level({
				description: "Intermediate",
				rows : 16,
				cols : 16,
				bombs : 40
			}),
			new mineSweeper.Level({
				description: "Hard",
				rows : 30,
				cols : 16,
				bombs : 99
			})];

		//Operations
		my.generateGrid = function () {
			my.activeGame(false);
			my.openNum(0);
			var grd = [];
			for (var i = 0; i < my.level().rows; i++) {
				grd[i] = [];
				for (var y = 0; y < my.level().cols; y++){
					grd[i][y] = new mineSweeper.GridItem(i,y);
				}
			}
			my.grid(grd);
			my.generateBombs();
			my.activeGame(true);
			my.seconds(0);
			my.minutes(0);
			my.timer.start(function(t) {
				my.seconds(t.seconds);
				my.minutes(t.minutes);
			});
			$("#game-lost").hide();
			$("#game-won").hide();
		};

		my.generateBombs = function () {
			my.bombs([]);

			var updateAdjacent = function (gridElem) {
				gridElem.numberOfBombs(gridElem.numberOfBombs() + 1);
			};

			for (var i = 0; i < my.level().bombs; i++) {
				var bomb = my.generateSingleBomb();
				my.bombs().push(bomb);
				my.updateNeighbors(bomb, updateAdjacent);
			}
		};
		
		my.generateSingleBomb = function () {
			var b;
			(function getUnique() {
				b = my.grid()[my.getRandomInt(0,my.level().rows -1)][my.getRandomInt(0, my.level().cols -1)];
				while(b.isBomb()) {
					getUnique();
				}
			})();
				
			b.isBomb(true);
			return b;
		};
		
		my.updateNeighbors = function (gridItem, callback) {
			var withinBounds = function(x, y) {
				if ((x < 0 || x >= my.level().rows) || (y < 0 || y >= my.level().cols)) {
					return false;
				}
				return true;
			};
			for (var x = gridItem.x - 1; x  <= gridItem.x + 1; x++) {
				for (var y = gridItem.y - 1; y <= gridItem.y + 1; y++) {
					if (withinBounds(x,y) && callback) {
						callback(my.grid()[x][y]);
					}
				}
			}
		};
		my.OpenItem = function (gridItem) {
			
			if (!my.activeGame() || gridItem.open()) {
				return;
			}
			
			if (gridItem.isBomb()) {
				my.endGameLose();
				return;
			}
			gridItem.open(true);
			my.openNum(my.openNum()+1);
			if(my.level().winningCondition(my.openNum())) {
				my.endGameWin();
			}
			if(gridItem.numberOfBombs() === 0) {
				my.updateNeighbors(gridItem, function (gridElem) {
					if(!gridElem.isBomb()) {
						my.OpenItem(gridElem);
					}
				});
			}
		};
		my.getRandomInt = function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		my.endGameLose = function () {
			my.displayAllBombs();
			my.activeGame(false);
			my.timer.stop();
			$("#game-lost").show();
		};
		
		my.endGameWin = function () {
			my.displayAllBombs();
			my.activeGame(false);
			my.timer.stop();
			$("#game-won").show();
		};
		
		my.displayAllBombs = function () {
			for (var i = 0; i < my.bombs().length; i++) {
				my.bombs()[i].open(true);
			}
		};
	};
} (this.mineSweeper = this.mineSweeper || {}));;(function (mineSweeper) {
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