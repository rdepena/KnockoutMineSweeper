window.mineSweeper = {};;(function(mineSweeper) {
	"use strict";
	
	//GridItem Object
	mineSweeper.GridItem = function (x, y) {

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
	};
	//cheap way to do this.
	mineSweeper.numberClasses = ["none","one", "two", "three", "four", "five", "six"];	

}(this.mineSweeper = this.mineSweeper || {}));
;(function (mineSweeper){
	"use strict";
	
	//difficulty level Object
	mineSweeper.Level = function (options) {

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
	};

}(this.mineSweeper = this.mineSweeper || {}));
;(function (mineSweeper) {

	"use strict";
	//Mines using knockout JS
	mineSweeper.MineSweeperViewModel = function () {
		var self = this;
		//Data
		self.activeGame = ko.observable(false);
		self.openNum = ko.observable(0);
		self.grid = ko.observableArray();
		self.bombs = ko.observableArray();
		self.level = ko.observable();
		self.seconds = ko.observable(0);
		self.minutes = ko.observable(0);

		self.timeDisplay = function (t) {
			return t < 9 ? "0" + t : t;
		};

		self.secondsDisplay = ko.computed(function () {
			return self.timeDisplay(self.seconds());
		});
		self.minutesDisplay = ko.computed(function () {
				return self.timeDisplay(self.minutes());
		});

		self.levels = [
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
		self.generateGrid = function () {
			self.activeGame(false);
			self.openNum(0);
			var grd = [];
			for (var i = 0; i < self.level().rows; i++) {
				grd[i] = [];
				for (var y = 0; y < self.level().cols; y++){
					grd[i][y] = new mineSweeper.GridItem(i,y);
				}
			}
			self.grid(grd);
			self.generateBombs();
			self.activeGame(true);
			self.seconds(0);
			self.minutes(0);
			
			self.timer = mineSweeper.Timer();
			self.timer.start(function(t) {
				self.seconds(t.seconds);
				self.minutes(t.minutes);
			});
		};

		self.generateBombs = function () {
			self.bombs([]);

			var updateAdjacent = function (gridElem) {
				gridElem.numberOfBombs(gridElem.numberOfBombs() + 1);
			};

			for (var i = 0; i < self.level().bombs; i++) {
				var bomb = self.generateSingleBomb();
				self.bombs().push(bomb);
				self.updateNeighbors(bomb, updateAdjacent);
			}
		};
		
		self.generateSingleBomb = function () {
			var b;
			(function getUnique() {
				b = self.grid()[self.getRandomInt(0,self.level().rows -1)][self.getRandomInt(0, self.level().cols -1)];
				while(b.isBomb()) {
					getUnique();
				}
			})();
				
			b.isBomb(true);
			return b;
		};
		
		self.updateNeighbors = function (gridItem, callback) {
			var withinBounds = function(x, y) {
				if ((x < 0 || x >= self.level().rows) || (y < 0 || y >= self.level().cols)) {
					return false;
				}
				return true;
			};
			for (var x = gridItem.x - 1; x  <= gridItem.x + 1; x++) {
				for (var y = gridItem.y - 1; y <= gridItem.y + 1; y++) {
					if (withinBounds(x,y) && callback) {
						callback(self.grid()[x][y]);
					}
				}
			}
		};
		self.OpenItem = function (gridItem) {
			
			if (!self.activeGame() || gridItem.open()) {
				return;
			}
			
			if (gridItem.isBomb()) {
				self.endGameLose();
				return;
			}
			gridItem.open(true);
			self.openNum(self.openNum()+1);
			if(self.level().winningCondition(self.openNum())) {
				self.endGameWin();
			}
			if(gridItem.numberOfBombs() === 0) {
				self.updateNeighbors(gridItem, function (gridElem) {
					if(!gridElem.isBomb()) {
						self.OpenItem(gridElem);
					}
				});
			}
		};
		self.getRandomInt = function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		self.endGameLose = function () {
			self.displayAllBombs();
			self.activeGame(false);
			self.timer.stop();
			alert("you blew up.");
		};
		
		self.endGameWin = function () {
			self.displayAllBombs();
			self.activeGame(false);
			self.timer.stop();
			alert("You are a Winrar!!!");
		};
		
		self.displayAllBombs = function () {
			for (var i = 0; i < self.bombs().length; i++) {
				self.bombs()[i].open(true);
			}
		};
	};
} (this.mineSweeper = this.mineSweeper || {}));;(function (mineSweeper) {
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