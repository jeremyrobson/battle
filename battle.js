class BattleQueue {
    constructor() {
        this.list = [];
        this.buffer = [];
    }

    tick() {
        this.list = this.list.filter(function(item) {
            return !item.remove;
        });

        this.sort();

        if (this.list[0].ready) {
            return this.list[0];
        }

        this.list.forEach(function(item) {
            item.tick();
        });

        return null;
    }

    add(item) {
        this.list.push(item);
        this.sort();
    }

    sort() {
        this.list.sort(function(a, b) {
            if (a.ctr < b.ctr) return -1;
            if (a.ctr > b.ctr) return 1;
            if (a.priority > b.priority) return -1;
            if (a.priority < b.priority) return 1;
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0; //this should never happen
        });
    }

    getActions(x, y, ctr) {
        return this.list.filter(function(item) {
            return item instanceof BattleAction && 
                item.ctr <= ctr &&
                listHasPoint(item.spread, x, y);
        });
    }

    draw(ctx) {
        this.list.forEach(function(item) {
            if (item instanceof BattleAction) {
                ctx.fillStyle = "rgb(255, 255, 0)";
                ctx.font = "12px Arial";
                ctx.fillText(item.ctr, item.x * TILE_WIDTH, item.y * TILE_HEIGHT);
            }
        });
    }

    toString() {
        var outputText = "";
        this.list.forEach(function(item) {
            outputText += item.toString() + "\n";
        });
        return outputText;
    }
}

class BattleUnit {
    constructor(team, action) {
        this.id = Math.floor(Math.random() * 10000000);
        this.team = team;
        this.sprite = Math.floor(Math.random() * 90) + 10;
        this.color = ["rgb(255,0,0)", "rgb(0,255,0)"][team];
        this.x = Math.floor(Math.random() * MAP_WIDTH),
        this.y = Math.floor(Math.random() * MAP_HEIGHT),
        this.ct = 100; //CT divided by AGL gives CTR
        this.ctr = 0; //unit turn when CTR = 0
        this.hp = Math.floor(Math.random() * 50) + 50;
        this.agl = Math.floor(Math.random() * 5) + 5;
        this.actionmove = null;
        this.priority = 0; //actions and moves go before unit turns
        this.ready = this.ctr === 0;
        this.moved = false;
        this.acted = false;

        this.actions = [actions[action]];
    }

    tick() {
        this.ctr -= 1;
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
    }

    invoke(battle) {
        if (!this.moved && !this.acted) {
            if (this.actionmove) {
                console.log("Unit No. " + this.actionmove.unit.sprite + " is already preparing to act.");
                //todo: if action is sticky, allow movement
                this.acted = true;
            }
            else {
                var bestAction = getBestAction(battle, this);
                if (bestAction.mustMoveFirst()) {
                    var requiredMove = new BattleMove(
                        this,
                        bestAction.node
                    );
                    battle.queue.add(requiredMove);
                    this.moved = true;
                }
                else {
                    battle.queue.add(bestAction);
                    this.actionmove = bestAction;
                    this.acted = true;
                }
            }
        }
        else if (this.acted && !this.moved) {
            var bestMove = getBestMove(battle, this);
            battle.queue.add(bestMove);
            this.done();
            return null;
        }
        else if (!this.acted && this.moved) {
            if (this.actionmove) {
                console.log("I SAID Unit No. " + this.actionmove.unit.sprite + " is already preparing to act!!!");
            }
            else {
                var bestAction = getBestAction(battle, this);
                battle.queue.add(bestAction);
                this.actionmove = bestAction;
            }
            this.acted = true;
            this.done();
            return null;
        }
        else {
            //battle.queue.add(new DoNothing(battle, this));
            this.done();
            return null;
        }

        return this;
    }

    done() {
        if (this.moved && this.acted) {
            this.ct = 100;
        }
        else if (this.moved) {
            this.ct = 80;
        }
        else if (this.acted) {
            this.ct = 80;
        }
        else {
            this.ct = 60;
        }
        this.ctr = Math.ceil(this.ct / this.agl);
        this.ready = false;
        this.moved = false;
        this.acted = false;
    }

    draw(ctx) {
        var dx = this.x * TILE_WIDTH;
        var dy = this.y * TILE_HEIGHT;
        ctx.font = "25px Arial";
        ctx.textBaseline = "top";
        ctx.fillStyle = this.color;
        ctx.fillText(this.sprite, dx, dy);
    }

    toString() {
        return "Unit No. " + this.sprite + " - CTR: " + this.ctr + ", Ready: " + this.ready;
    }
}

class GameBattle {
    constructor() {
        this.units = [];
        this.queue = new BattleQueue();
        this.activeItem = null;
        this.mapNodes = [];
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;

        this.tile = generateTiles(MAP_WIDTH, MAP_HEIGHT);
    }

    start() {
        this.units.forEach(function(u) {
            this.queue.add(u);
            u.done();
        }, this);
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

    addUnit(unit) {
        this.units.push(unit);
        this.tile[unit.x][unit.y].addUnit(unit);
    }

    moveUnit(unit, node) {
        this.tile[unit.x][unit.y].removeUnit(unit);
        unit.x = node.x;
        unit.y = node.y;
        this.tile[unit.x][unit.y].addUnit(unit);
    }

    draw(ctx) {
        ctx.clearRect(0, 0, 640, 480);
        for (var x=0; x<MAP_WIDTH; x++) {
            for (var y=0; y<MAP_HEIGHT; y++) {
                ctx.fillStyle = "rgb(0,150,50)";
                ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            }
        }

        this.mapNodes.forEach(function(node) {
            var r = Math.floor(255 * (1 - node.safetyScore));
            var b = Math.floor(255 * node.safetyScore);
            ctx.fillStyle = "rgb(" + r + ",0," + b + ")";
            ctx.fillRect(node.x * TILE_WIDTH, node.y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        });

        if (this.activeItem) {
            this.activeItem.draw(ctx);
        }

        this.units.forEach(function(u) {
            u.draw(ctx);
        });

        this.queue.draw(ctx);
    }
}