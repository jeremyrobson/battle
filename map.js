function generateTiles(width, height) {
    var tiles = [];
    for (var x=0; x<width; x++) {
        tiles[x] = [];
        for (var y=0; y<height; y++) {
            if (Math.random() > 0.75) {
                tiles[x][y] = new Tile(x, y, "wall", "rgb(100,100,100)");
            }
            else {
                tiles[x][y] = new Tile(x, y, "grass", "rgb(200,200,200)");
            }
            
        }
    }
    return tiles;
}

class Tile {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        this.units = [];
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