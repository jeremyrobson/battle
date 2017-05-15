function inRange(x, y) {
    return x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT;
}

function generateTiles(width, height) {
    var tiles = [];
    for (var x=0; x<width; x++) {
        tiles[x] = [];
        for (var y=0; y<height; y++) {
            if (Math.random() > 0.75) {
                tiles[x][y] = new Tile(x, y, "tree", "rgb(100,100,100)", 0x1F334);
            }
            else {
                tiles[x][y] = new Tile(x, y, "grass", "rgb(200,200,200)", null);
            }
            
        }
    }
    return tiles;
}

class Tile {
    constructor(x, y, type, color, sprite) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.sprite = String.fromCodePoint(sprite);
        this.units = [];
    }

    draw(ctx) {
        var dx = this.x*TILE_WIDTH;
        var dy = this.y*TILE_HEIGHT;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle="rgb(200,200,200)";
        ctx.rect(dx,dy,TILE_WIDTH,TILE_HEIGHT);
        ctx.stroke();
        
        if (this.sprite) {
            ctx.fillText(this.sprite, dx, dy);
        }
    }

    addUnit(unit) {
        this.units.push(unit);
    }

    removeUnit(unit) {
        //todo: speed up using indexing
        this.units = this.units.filter(function(u) {
            return u.id !== unit.id;
        });
    }

    getUnits() {
        return this.units;
    }

    toString() {
        return "X: " + this.x + ", Y: " + this.y + ", Units: " + this.units.length;
    }
}

class BattleMap {
    constructor(width, height, units) {
        this.width = width;
        this.height = height;
        this.tiles = generateTiles(width, height);
        
        units.forEach(function(u) {
            this.tiles[u.x][u.y].addUnit(u);
        }, this);
    }

    moveUnit(unit, x, y) {
        this.tiles[unit.x][unit.y].removeUnit(unit);
        unit.x = x;
        unit.y = y;
        this.tiles[x][y].addUnit(unit);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, 640, 480);

        for (var x=0;x<MAP_WIDTH;x++) {
            for (var y=0;y<MAP_HEIGHT;y++) {
                this.tiles[x][y].draw(ctx);
            }
        }
    }
}