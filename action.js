function createDiamond(x, y, range, includeCenter) {
    var diamond = [];
    for (var i=-range; i<=range; i++) {
        for (var j=-range; j<=range; j++) {
            if (!includeCenter && i == 0 && j == 0) {
                continue;
            }
            else if (Math.abs(i) + Math.abs(j) <= range) {
                diamond.push({
                    x: i + x,
                    y: j + y
                });
            }
        }
    }
    return diamond;
}

function getDamage(actor, target, action) {
    var damage = 10;

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
    var moveList = getMapNodes(tiles, MAP_WIDTH, MAP_HEIGHT, units, unit, 0); //list of possible move nodes

    unit.jobclass.actions.forEach(function(action) {
        moveList.forEach(function(node) {
            var diamond = createDiamond(node.x, node.y, action.range, false); //list of possible action nodes
            diamond.forEach(function(d) {
                var newspread = [];
                var totalDamage = 0;
                var totalScore = 0;

                action.spread.forEach(function(s) {
                    var x = s[0] + d.x; //target node x
                    var y = s[1] + d.y; //target node y

                    if (inRange(x, y)) { //if target node is in range
                        var target = null;

                        if (x === node.x && y === node.y) { //is this where the actor is moving to?
                            target = unit;
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
                if (totalDamage === 0) {
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
                    score: totalScore
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