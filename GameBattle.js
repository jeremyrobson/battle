class GameBattle {
    constructor(units) {
        this.units = units;
        this.queue = new BattleQueue(this.units);
        this.activeItem = null;

        this.tiles = generateTiles(MAP_WIDTH, MAP_HEIGHT);

        units.forEach(function(u) {
            this.tiles[u.x][u.y].addUnit(u);
        }, this);

        //nodes = getMapNodes(tiles, MAP_WIDTH, MAP_HEIGHT, units, units[0], 100);
        //safetyMap = generateSafetyMap(units, units[0]);
        //coverage = generateCoverage(units, units[0], units[0].jobclass.actions[0]);
    }

    start() {
        this.units.forEach(function(u) {
            u.done();
        });
    }

    update() {
        
        if (this.activeItem) {
            this.activeItem = this.activeItem.invoke(this);
            this.queue.sort();
        }
        else {
            this.activeItem = this.queue.tick();
        }

        output.value = this.queue.toString();
    }

    moveUnit(unit, node) {
        this.tiles[unit.x][unit.y].removeUnit(unit);
        unit.x = node.x;
        unit.y = node.y;
        this.tiles[unit.x][unit.y].addUnit(unit);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, 640, 480);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        if (this.activeItem && this.activeItem.safetyMap) {
            this.activeItem.safetyMap.forEach(function(t) {
                var r = Math.floor(t.safetyScore * 255);
                var g = Math.floor((1-t.safetyScore) * 255);
                ctx.fillStyle = "rgba("+r+","+g+","+g+",1.0)";
                ctx.fillRect(t.x*TILE_WIDTH, t.y*TILE_WIDTH, TILE_WIDTH-1, TILE_WIDTH-1);
            });
        }

        for (var x=0; x<MAP_WIDTH; x++) {
            for (var y=0; y<MAP_HEIGHT; y++) {
                this.tiles[x][y].draw(ctx);
            }
        }

        if (this.activeItem instanceof BattleMove) {
            this.activeItem.node.draw(ctx);
        }

        this.units.forEach(function(u) {
            u.draw(ctx);
        });
    }
}

function drawNodes(ctx) {
    nodes.forEach(function(node) {
        var r = Math.floor(node.stepScore * 255);
        var g = Math.floor((1-node.stepScore) * 255);
        ctx.fillStyle = "rgba("+r+","+g+",0,1.0)";
        ctx.fillRect(node.x*TILE_WIDTH, node.y*TILE_WIDTH, TILE_WIDTH-1, TILE_WIDTH-1);
    });
}

function drawCoverage(ctx) {
    coverage.forEach(function(c) {
        var g = Math.floor(c.score * 255);
        var r = Math.floor((1-c.score) * 255);
        ctx.fillStyle = "rgba("+r+","+g+","+g+",1.0)";
        ctx.fillRect(c.x*TILE_WIDTH, c.y*TILE_WIDTH, TILE_WIDTH-1, TILE_WIDTH-1);
    });
}