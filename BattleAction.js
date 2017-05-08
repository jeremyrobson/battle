class BattleAction {
    constructor(battle, unit, coverage) {
        this.unit = unit;
        this.action = coverage.action;  //what???
        this.ctr = Math.floor(Math.random() * 20); //actions[action].ctr;
        this.range = coverage.action.range;
        this.spread = coverage.spread;
        this.x = coverage.targetX;
        this.y = coverage.targetY;
        this.node = coverage.node; //where the unit must be to complete action
        this.ready = false;
        this.remove = false;
        this.score = 0;
    }

    tick() {
        console.log("action tick");
        this.ctr -= 1;
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
    }

    invoke(battle) {
        console.log("action invoke");
        this.done();
        return null;
    }

    done() {
        this.remove = true;
        this.unit.actionmove = null;
        console.log("cleared unit " + this.unit.id + "'s actionmove");
    }

    draw(ctx) {

    }

    mustMoveFirst() {
        return (!(this.unit.x === this.node.x && this.unit.y === this.node.y));
    }

    toString() {
        return "Action - " + this.unit.sprite + " - CTR: " + this.ctr + ", Node: " + this.x + ", " + this.y;
    }
}

class DoNothing {
    constructor(battle, unit) {
        this.unit = unit;
        this.ctr = 0;
        this.ready = true;
    }

    tick() {
        console.log("do nothing tick");
    }

    invoke() {
        this.done();
        this.unit.actionmove = null;
        return null;
    }

    done() {
        console.log("Unit No. " + this.unit.sprite + " did nothing...");
    }

    draw(ctx) {

    }

    toString() {
        return "Unit No. " + this.unit.sprite + ", - CTR: " + this.ctr  + ", Ready: " + this.ready;
    }
}

function getBestAction(battle, unit) {
    var bestAction = null;
    var possibleActions = [];

    var mapNodes = getMapNodes(battle, battle.units, unit);

    mapNodes.sort(function(a, b) { //most dangerous
        return a.safetyScore - b.safetyScore;
    });

    battle.mapNodes = mapNodes;

    unit.actions.forEach(function(action) {
        mapNodes.forEach(function(node) {
            var score = node.safetyScore;

            var diamond = createDiamond(node.x, node.y, action.range, action.targetSelf);

            diamond.forEach(function(d) {
                var spread = getSpread(d.x, d.y, action);
                spread.forEach(function(s) {
                    var targetList = getTargetList(battle, unit, node, action.spread);

                    targetList.forEach(function(target) {
                        score += action.getDamage(target);
                    });
                });

                var possibleAction = new BattleAction(
                    battle,
                    unit,
                    action,
                    d,
                    node,
                    score
                );

                possibleActions.push(possibleAction);
            });
        });
    });

    possibleActions.sort(function(a, b) {
        return b.score - a.score;
    });

    bestAction = possibleActions[0];

    return bestAction;
}