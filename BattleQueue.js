class BattleQueue {
    constructor(units) {
        this.list = [];
        this.buffer = [];

        units.forEach(function(u) {
            this.list.push(u);
        }, this);
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

    draw(ctx) {
        this.list.forEach(function(item) {
            if (item instanceof BattleAction) {
                item.spread.forEach(function(s) {
                    ctx.fillStyle = "rgba(255, 0, 255, 1.0)";
                    ctx.fillRect(s.x * TILE_WIDTH, s.y * TILE_HEIGHT, TILE_WIDTH - 1, TILE_HEIGHT - 1);
                    ctx.fillStyle = "rgba(255,255,255,1.0)";
                    ctx.font = "16px Arial";
                    ctx.fillText(item.ctr, s.x * TILE_WIDTH + 16, s.y * TILE_WIDTH + 16);
                });
            }
        });
    }

    getActions(x, y, ctr) {
        return this.list.filter(function(item) {
            return item instanceof BattleAction && 
                item.ctr <= ctr &&
                listHasPoint(item.spread, x, y);
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