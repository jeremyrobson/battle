function createDiamond(x, y, range, maxWidth, maxHeight, includeCenter) {
    var diamond = [];
    for (var i=-range; i<=range; i++) {
        for (var j=-range; j<=range; j++) {
            if (!includeCenter && i == 0 && j == 0) {
                continue;
            }
            else if (Math.abs(i) + Math.abs(j) <= range) {
                var dx = i + x;
                var dy = j + y;
                if (dx >= 0 && dy >= 0 && dx < maxWidth && dy < maxHeight) {
                    diamond.push({
                        x: i + x,
                        y: j + y
                    });
                }
            }
        }
    }
    return diamond;
}

function getDamage(actor, target, action) {
    var damage = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;

    return damage;
}

function getScore(actor, target, damage) {
    var score = 0;
    
    if (actor.team === target.team) {
        score -= damage;
    }
    else {
        score += damage;
    }

    return score;
}

//generate action coverage for a particular unit
function generateCoverage(tiles, units, unit) {
    var min = 0, max = 1;
    var coverage = [];
    var mapNodes = getMapNodes(tiles, MAP_WIDTH, MAP_HEIGHT, units, unit, -999); //list of possible move nodes

    mapNodes = mapNodes.filter(function(node) {
        return node.steps <= unit.move;
    });

    unit.mapNodes = mapNodes;

    unit.jobclass.actions.forEach(function(action) {
        mapNodes.forEach(function(node) {
            var diamond = createDiamond(node.x, node.y, action.range, MAP_WIDTH, MAP_HEIGHT, false); //list of possible action nodes
            diamond.forEach(function(d) {
                var newspread = [];
                var totalDamage = 0;
                var totalScore = 0;

                action.spread.forEach(function(s) {
                    var x = s[0] + d.x; //target node x
                    var y = s[1] + d.y; //target node y
                    
                    if (inRange(x, y)) { //if target node is in range
                        //save spread so queue can see if action contains point (or something like that)
                        newspread.push({
                            x: x,
                            y: y
                        });

                        var target = null;

                        if (x === node.x && y === node.y) { //is this where the actor is moving to?
                            target = unit; //then he hits himself
                        }
                        else {
                            target = tiles[x][y].getUnits()[0]; //get unit at target node
                        }

                        if (target) { //if target unit exists
                            var damage = getDamage(unit, target, action); //get damage
                            totalScore += getScore(unit, target, damage); //get score from damage
                            totalDamage += damage; //add damage to running total for this action
                        }
                    }
                });

                //if nothing was accomplished in the spread, ignore this action node
                if (totalScore <= 0) {
                    return;
                }

                var dx = d.x - node.x;
                var dy = d.y - node.y;
                var distance = Math.sqrt(dx*dx + dy*dy); //distance from action node to move node

                totalScore += distance; //todo: for ranged attacks higher is better, for ranged buffs lower is better

                coverage.push({
                    actor: unit,
                    action: action,
                    node: node,
                    targetX: d.x,
                    targetY: d.y,
                    distance: distance,
                    damage: totalDamage,
                    score: totalScore,
                    spread: newspread
                });

                min = totalScore < min ? totalScore : min;
                max = totalScore > max ? totalScore : max;
            });
        });
    });

    coverage.forEach(function(c) {
        c.score = (c.score - min) / (max - min);
    });

    coverage.sort(function(a, b) {
        return b.score - a.score;
    });

    return coverage;
}

class BattleAction {
    constructor(unit, coverage) {
        this.unit = unit;
        this.action = coverage.action;  //what???
        this.ctr = Math.floor(Math.random() * 50); //actions[action].ctr;
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
        console.log("BattleAction: action tick");
        
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
        else {
            this.ctr -= 1;
        }
    }

    invoke(battle) {
        console.log("BattleAction: action invoke");
        
        var targets = [];

        this.spread.forEach(function(s) {
            var target = map.tiles[s.x][s.y].getUnits()[0];
            if (target) {
                targets.push(target);
            }
        });

        targets.forEach(function(target) {
            var damages = getDamage(this.unit, target, this.action);
            console.log(this.unit.name + " used " + this.action.name + " on " + target.name + " for " + damages + " damages.");
        }, this);

        this.done();
        return null;
    }

    done() {
        this.remove = true;
        this.unit.action = null;
        this.unit.acted = true;
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
        console.log("BattleAction: do nothing tick");
    }

    invoke() {
        this.done();
        this.unit.action = null;
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