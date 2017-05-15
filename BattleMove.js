function getBestMove(tiles, units, unit) {
    var bestMove = null;

    var mapNodes = getMapNodes(tiles, MAP_WIDTH, MAP_HEIGHT, units, unit, -999);

    mapNodes = mapNodes.filter(function(node) {
        return node.steps < unit.move;
    });

    //can i move and still perform this action?
    if (unit.action) {
        //todo
        console.log("Move: already acting!!")
    }

    //mapNodes.sort(function(a, b) {
    //    return b.safetyScore - a.safetyScore;
    //});

    //if (tiles[mapNodes[0].x][mapNodes[0].y].units.length > 0) {
    //    console.log(mapNodes[0]);
    //}

    mapNodes.sort(function(a,b) {
        return b.steps - a.steps;
    });

    bestMove = new BattleMove(
        unit,
        mapNodes[0]
    );

    return bestMove;
}

class BattleMove {
    constructor(unit, node) {
        this.unit = unit;
        this.node = node;
        this.path = getPath(node);
        this.ctr = 0;
        this.ready = false;
        this.priority = 1;
        this.remove = false;
    }

    tick() {
        console.log("BattleMove: move tick");
        
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
        else {
            this.ctr -= 1;
        }
    }

    invoke() { //todo: figure out if passing map rather than keeping map global
        console.log("BattleMove: move invoke");
        if (this.path.length > 0) {
            var node = this.path.shift();
            map.moveUnit(this.unit, node.x, node.y);
            return this;
        }
        else {
            this.done();
            return null;
        }
    }

    done() {
        this.unit.moved = true;
        this.remove = true;
    }

    draw(ctx) {
        var node = this.node;
        while (node) {
            node.draw(ctx);
            node = node.parent;
        }
    }

    toString() {
        return "Move - " + this.unit.sprite + " - CTR: " + this.ctr + ", Node: " + this.node.x + ", " + this.node.y;
    }
}