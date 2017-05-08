class BattleParty {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }
}

class BattleUnit {
    constructor(id, team, sprite, color, jobclass) {
        this.id = id;
        this.team = team;
        this.sprite = String.fromCodePoint(sprite);
        this.color = color;
        this.jobclass = jobclass;
        this.x = Math.floor(Math.random() * MAP_WIDTH),
        this.y = Math.floor(Math.random() * MAP_HEIGHT),
        this.ct = 100;
        this.ctr = 0;
        this.agl = Math.floor(Math.random() * 5) + 5;
        this.actionmove = null;
        this.priority = 0; //actions and moves go before unit turns
        this.ready = this.ctr === 0;
        this.moved = false;
        this.acted = false;
        this.safetyMap = [];
    }

    tick() {
        this.ctr -= 1;
        if (this.ctr <= 0) {
            this.ctr = 0;
            this.ready = true;
        }
    }

    invoke(battle) {
        this.safetyMap = generateSafetyMap(battle.units, this);
        var coverage = generateCoverage(battle.tiles, battle.units, this);

        if (!this.moved && !this.acted) {
            if (this.actionmove) {
                console.log("Unit No. " + this.actionmove.unit.id + " is already preparing to act.");
                //todo: if action is sticky, allow movement
                this.acted = true;
            }
            else {
                this.actionmove = new BattleAction(battle, this, coverage[0]);

                //if the node is different from the unit location, the unit must move into position
                if (this.actionmove.node.x != this.x || this.actionmove.node.y != this.y) {
                    battle.queue.add(new BattleMove(this, this.actionmove.node));
                    battle.queue.add(this.actionmove);
                    this.moved = true;
                }
                else {
                    battle.queue.add(this.actionmove);
                    this.acted = true;
                }
            }
        }
        else if (this.acted && !this.moved) {
            battle.queue.add(new BattleMove(this, coverage[0].node));
            this.done();
            return null;
        }
        else if (!this.acted && this.moved) {
            if (this.actionmove) {
                console.log("I SAID Unit No. " + this.actionmove.unit.id + " is already preparing to act!!!");
            }
            else {
                this.actionmove = new BattleAction(battle, this, coverage[0]);
                battle.queue.add(this.actionmove);
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
        ctx.font = UNIT_FONT;
        ctx.textBaseline = "top";
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.fillText(this.sprite, dx, dy);
    }

    toString() {
        return this.sprite + " - CTR: " + this.ctr + ", Ready: " + this.ready;
    }
}