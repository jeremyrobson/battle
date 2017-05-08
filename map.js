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
        //ctx.fillRect(dx, dy, TILE_WIDTH-1, TILE_HEIGHT-1);
        ctx.fillText(this.sprite, dx, dy);
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