function listHasPoint(list, x, y) {
    for (var p = 0; p < list.length; p++) {
        if (list[p].x === x && list[p].y === y) {
            return true;
        }
    }
    return false;
}

class MoveNode {
    constructor(x, y, steps, parent) {
        this.x = x;
        this.y = y;
        this.steps = steps;
        this.parent = parent;
        this.safetyScore = 0;
        this.stepScore = 0;
    }

    equals(x, y) {
        return this.x === x && this.y === y;
    }

    draw(ctx) {
        var node = this;

        while (node) {
            ctx.fillStyle = "rgba(0, 0, 155, 0.8)";
            ctx.fillRect(node.x * TILE_WIDTH, node.y * TILE_HEIGHT, TILE_WIDTH - 1, TILE_HEIGHT - 1);
            node = node.parent;
        }
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

function getTileSafetyScore(battle, units, unit, x, y) {
    var safetyScore = 0;

    units.forEach(function(u) {
        if (u.id === unit.id) {
            return;
        }

        var dx = x - u.x;
        var dy = y - u.y;
        var distance = Math.sqrt(dx*dx + dy*dy);
        if (u.team === unit.team) { //distance from ally
            safetyScore += (distance === 0) ? 1 : (1 / distance);
        }
        else { //distance from enemy
            safetyScore -= (distance === 0) ? 1 : (1 / distance);
        }
    });

    //check queue for future action spreads that hit this tile
    var actions = battle.queue.getActions(x, y, 20); //find all actions under 20 ctr
    actions.forEach(function(action) {
        // "what if" the unit moved to the proposed x,y?
        var damage = getDamage(action.actor, unit, action.action);
        if (damage > 0) { //unit would be damaged
            safetyScore -= 1;
        }
        if (unit.hp - damage < 0) { //unit would be killed
            safetyScore -= 2;
        }
        if (damage < 0) { //unit would be healed
            safetyScore += 1;
        }
        
    });

    return safetyScore;
}

function createBinaryMap(map, width, height) {
    var bmap = [];
    for (var x=0; x<width; x++) {
        bmap[x] = [];
        for (var y=0; y<height; y++) {
            bmap[x][y] = 0;
        }
    }
    return bmap;
}

function getMapNodes(map, width, height, units, unit, maxSteps, filtered = false) {
    var binaryMap = createBinaryMap(map, width, height);
    binaryMap[unit.x][unit.y] = 1; //visit starting node

    var i = 0, steps = 0;
    var xList = [0, -1, 0, 1];
    var yList = [-1, 0, 1, 0];
    var min = 0, max = 0;

    var nodeList = [new MoveNode(unit.x, unit.y, 0, null, 0)];

    while (i < nodeList.length) {
        for (var j=0; j<4; j++) {

            var x = nodeList[i].x + xList[j];
            var y = nodeList[i].y + yList[j];
            var steps = nodeList[i].steps + 1;

            //if node is off the map
            if (x < 0 || y < 0 || x >= width || y >= height) {
                continue; //skip this node
            }

            //if node has already been visited
            if (binaryMap[x][y] === 1) {
                continue; //skip this node
            }

            //if node is not grass
            if (map[x][y].type != "grass") {
                continue; //skip this node
            }

            var mapUnit = map[x][y].units[0];

            //filter our enemy units
            if (filtered) {
                //if unit exists on node and is enemy
                if (mapUnit && mapUnit.team !== unit.team) {
                    //if enemy is not dead
                    if (mapUnit.status !== "dead") {
                        continue; //skip this node
                    }
                }
            }

            min = steps < min ? steps : min;
            max = steps > max ? steps : max;
            nodeList.push(new MoveNode(x, y, steps, nodeList[i]));

            binaryMap[x][y] = 1; //visit node
        }
        i++;
    }

    //filter out occupied nodes
    if (filtered) {
        //remove occupied mapNodes UNLESS occupied by self
        nodeList = nodeList.filter(function(node) {
            if (map[node.x][node.y].units.length > 0) { //if there are units
                if (map[node.x][node.y].units[0].id === unit.id) { //if unit is self
                    return true; //node is valid
                }
            }
            else { //if there are no units
                return true; //node is valid
            }
        });
    }

    /*
    nodeList.forEach(function(node) {
        node.stepScore = (node.steps - min) / (max - min);
    });
    */

    return nodeList;
}

function getPath(node) {
    var path = [];

    var current = node;

    while (current) {
        path.push(current);
        current = current.parent;
    }

    return path.reverse();
}