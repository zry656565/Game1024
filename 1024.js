J('bind');

var Game_1024 = function () {
    this.grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    this.emptyNum = 16;
    this.init();
};

Game_1024.prototype = {
    constructor: Game_1024,
    init: function() {
        //initialize 2 cells
        this.randomProduce();
        this.randomProduce();
    },
    randomProduce: function(){
        var randNum = Math.floor(Math.random()* this.emptyNum);
        var counter = 0;
        for (var x=0; x<4; x++) {
            for (var y=0; y<4; y++){
                if (this.grid[y][x] === 0) {
                    if (counter++ === randNum) {
                        this.emptyNum--;
                        this.grid[y][x] = Math.random()<0.8 ? 2: 4;
                    }
                }
            }
        }
    },
    printGrid: function(){
        console.log("Grid:");
        for (var i=0; i<this.grid.length; i++) {
            console.log(this.grid[i]);
        }
        console.log('\n');
    },
    calcWeight: function(grid){
        var weight = 0;
        for (var x=0; x<4; x++) {
            for (var y=0; y<4; y++) {
                if (grid[y][x] !== 0) {
                    //find first element right
                    for (var k=x+1; k<4; k++) {
                        if (grid[y][k]>0) {
                            weight += Math.abs(grid[y][k]-grid[y][x]);
                            break;
                        }
                    }
                    //find first element down
                    for (var l=y+1; l<4; l++) {
                        if (grid[l][x]>0) {
                            weight += Math.abs(grid[l][x]-grid[y][x]);
                            break;
                        }
                    }
                }
            }
        }
        return weight;
    },
    getGridAfterMove: function(direction){
        var newGrid = this.grid.clone();
        var me = this;
        var goUp = function(x, y) {
            if (x < 0 || x >= 4 || y < 1 || y >= 4 || newGrid[y][x] === 0) {
                return;
            }
            if (newGrid[y-1][x] === 0) {
                newGrid[y-1][x] = newGrid[y][x];
                newGrid[y][x] = 0;
                goUp(x, y-1);
            } else if (newGrid[y-1][x] === newGrid[y][x]) {
                newGrid[y-1][x] *= 2;
                newGrid[y][x] = 0;
                me.emptyNum++;
            }
        };
        var goDown = function(x, y) {
            if (x < 0 || x >= 4 || y < 0 || y >= 3 || newGrid[y][x] === 0) {
                return;
            }
            if (newGrid[y+1][x] === 0) {
                newGrid[y+1][x] = newGrid[y][x];
                newGrid[y][x] = 0;
                goDown(x, y+1);
            } else if (newGrid[y+1][x] === newGrid[y][x]) {
                newGrid[y+1][x] *= 2;
                newGrid[y][x] = 0;
                me.emptyNum++;
            }
        };
        var goLeft = function(x, y) {
            if (x < 1 || x >= 4 || y < 0 || y >= 4 || newGrid[y][x] === 0) {
                return;
            }
            if (newGrid[y][x-1] === 0) {
                newGrid[y][x-1] = newGrid[y][x];
                newGrid[y][x] = 0;
                goLeft(x-1, y);
            } else if (newGrid[y][x-1] === newGrid[y][x]) {
                newGrid[y][x-1] *= 2;
                newGrid[y][x] = 0;
                me.emptyNum++;
            }
        };
        var goRight = function(x, y) {
            if (x < 0 || x >= 3 || y < 0 || y >= 4 || newGrid[y][x] === 0) {
                return;
            }
            if (newGrid[y][x+1] === 0) {
                newGrid[y][x+1] = newGrid[y][x];
                newGrid[y][x] = 0;
                goRight(x+1, y);
            } else if (newGrid[y][x+1] === newGrid[y][x]) {
                newGrid[y][x+1] *= 2;
                newGrid[y][x] = 0;
                me.emptyNum++;
            }
        };

        if (direction === 'up') {
            for (var x=0; x<4; x++) {
                for (var y=1; y<4; y++) {
                    goUp(x, y);
                }
            }
        } else if (direction === 'down') {
            for (var x=0; x<4; x++) {
                for (var y=2; y>=0; y--) {
                    goDown(x, y);
                }
            }
        } else if (direction === 'left') {
            for (var x=1; x<4; x++) {
                for (var y=0; y<4; y++) {
                    goLeft(x, y);
                }
            }
        } else if (direction === 'right') {
            for (var x=2; x>=0; x--) {
                for (var y=0; y<4; y++) {
                    goRight(x, y);
                }
            }
        }
        return newGrid;
    },
    goOneStep: function(){
        var directions = [ 'up', 'down', 'left', 'right' ];
        var gridList = [];
        var max = {
            id: -1,
            value: -1
        };
        for (var i=0; i<directions.length; i++) {
            var newGrid = this.getGridAfterMove(directions[i]);
            gridList.push(newGrid);
            var weight = this.calcWeight(newGrid);
            if (weight > max.value) {
                max.id = i;
                max.value = weight;
            }
        }
        this.grid = gridList[max.id];
        this.randomProduce();
        this.printGrid();
    },
    Play: function(){
        var me = this;
        setInterval(function(){
            me.goOneStep();
        }, 100);
    }
}

var game = new Game_1024();
game.Play();