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

    toString() {
        var outputText = "";
        this.list.forEach(function(item) {
            outputText += item.toString() + "\n";
        });
        return outputText;
    }
}