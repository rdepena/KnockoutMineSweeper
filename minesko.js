//Mines using knockout JS
function gridItem(x, y) {
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

function Level(options) {
	var self = this;
	options = options || {};
	self.description = options.description;
	self.rows = options.rows;
	self.cols = options.cols;
	self.bombs = options.bombs;
	self.winningCondition = function (openCells) {
		return openCells === (self.rows * self.cols) - self.bombs;
	};
}

function MineSweeperViewModel() {
	var self = this;
	//Data
	self.openNum = ko.observable(0);
	self.grid = ko.observableArray();
	self.bombs = ko.observableArray();
	self.level = ko.observable();
	self.levels = [
		new Level({
			description : "Easy",
			rows : 9,
			cols : 9,
			bombs : 10
		}),
		new Level({
			description: "Intermediate",
			rows : 16,
			cols : 16,
			bombs : 40
		}),
		new Level({
			description: "Hard",
			rows : 30,
			cols : 16,
			bombs : 99
		})];

	//Operations
	self.generateGrid = function () {
		var grd = [];
		for (var i = 0; i < self.level().rows; i++) {
			grd[i] = [];
			for (var y = 0; y < self.level().cols; y++){
				grd[i][y] = new gridItem(i,y);
			}
		}
		self.grid(grd);
		self.generateBombs();
	}
	
	self.generateBombs = function () {
		self.bombs(new Array());
		for (var i = 0; i < self.level().bombs; i++) {
			var bomb = self.generateSingleBomb();
			self.bombs().push(bomb);
			self.updateNeighbors(bomb, function(gridElem) {
				gridElem.numberOfBombs(gridElem.numberOfBombs() +1);
			});
		}
	}
	
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
	}
	
	self.updateNeighbors = function (gridItem, callback) {
		var withinBounds = function(x, y) {
			 if ((x < 0 || x >= self.level().rows) || (y < 0 || y >= self.level().cols)) {
				return false;
			 }
			 return true;
		}
		for (var x = gridItem.x - 1; x  <= gridItem.x + 1; x++) {
			for (var y = gridItem.y - 1; y <= gridItem.y + 1; y++) {
				if (withinBounds(x,y) && callback) {
					callback(self.grid()[x][y]);
				}
			}
		}
	}
	
	self.openEmptyItems = function (gridItem) {
		self.updateNeighbors(gridItem, function (gridElem) {
			if (!gridElem.isBomb()  && !gridElem.open()) {
				self.OpenItem(gridElem);
			}
		});
	}
	
	self.OpenItem = function (gridItem) {
		
		if (gridItem.open()) {
			return;
		}
		
		if (gridItem.isBomb()) {
			self.endGameLose();
			return;
		}
		
		gridItem.open(true);
		self.openNum(self.openNum()+1);
		if(gridItem.numberOfBombs() === 0) {
			self.openEmptyItems(gridItem);
		}
			
		if(self.level().winningCondition(self.openNum())) {
			self.endGameWin();
		}
	
	}
	self.getRandomInt = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	self.endGameLose = function () {
		self.displayAllBombs();
		alert("Lost.");
	}
	
	self.endGameWin = function () {
		self.displayAllBombs();
		alert("You are a Winrar!!!");
	}
	
	self.displayAllBombs = function () {
		for (var i = 0; i < self.bombs().length; i++) {
				self.bombs()[i].open(true);
			}
	}
}

ko.applyBindings(new MineSweeperViewModel());