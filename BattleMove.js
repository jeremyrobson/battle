class BattleMove {
    constructor(unit, node) {
        this.unit = unit;
        this.node = node;
        this.ctr = 0;
        this.ready = false;
        this.priority = 1;
        this.remove = false;
    }

    tick() {
        this.ctr -= 1;
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
    }

    invoke(battle) {
        battle.moveUnit(this.unit, this.node);
        this.done();
        return null;
    }

    done() {
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
        return "Move - Unit No. " + this.unit.sprite + " - CTR: " + this.ctr + ", Node: " + this.node.x + ", " + this.node.y;
    }
}

function getBestMove(battle, unit) {
    var bestMove = null;

    var mapNodes = getMapNodes(battle, battle.units, unit);

    mapNodes.sort(function(a, b) {
        return b.safetyScore - a.safetyScore;
    });

    if (battle.tile[mapNodes[0].x][mapNodes[0].y].units.length > 0) {
        console.log(mapNodes[0]);
    }

    battle.mapNodes = mapNodes;

    bestMove = new BattleMove(
        unit,
        mapNodes[0]
    );

    return bestMove;
}