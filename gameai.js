function moveTowards(target, distance) {
    var angle = getAngle(this, target);
    this.speed = clamp(distance / 10, 0, 2.0);
    this.x = this.x + Math.cos(angle) * this.speed;
    this.y = this.y + Math.sin(angle) * this.speed;
}

function moveAwayFrom(target, distance) {
    var angle = getAngle(this, target);
    this.speed = -clamp(distance / 10, 0, 2.0);
    this.x = this.x + Math.cos(angle) * this.speed;
    this.y = this.y + Math.sin(angle) * this.speed;
}

class GameAI {
    constructor() {
        this.movelist = [];
        this.actionlist = [];
        this.targetReached = false;
        this.distance = 0;
        this.minDistance = 1;
    }
    
    loop(self) {
        this.minDistance = self.minDistance;
    }
    
    addMoveTarget(movetarget) {
        this.movelist.push(movetarget);
    }
    
    addActionTarget(action) {
        this.actionlist.push(action);
    }
}

class Following extends GameAI {
    constructor(movetarget) {
        super();
        this.addMoveTarget(movetarget);
    }
    
    loop(self) {
        super.loop(self);
        
        if (this.movelist[0])
            this.distance = getDistance(self, this.movelist[0]);
        
        if (this.distance > this.minDistance)
            self.moveTowards(this.movelist[0], this.distance);
        
        //if (this.targetReached) {
            //self.moveAwayFrom(this.movelist[0], this.distance);
            //this.targetReached = false;
        //}
        
        if (this.distance <= this.minDistance) {
            this.targetReached = true;

            if (this.movelist.length > 1) //don't remove the last target because it could start moving again
                this.movelist.shift(0);
        }
    }
    
}

class Loitering extends GameAI {
    constructor() {
        super();
    }
    
    loop(self, map) {
        super.loop(self);
        
        if (this.movelist[0])
            this.distance = getDistance(self, this.movelist[0]);
        
        if (this.distance > this.minDistance)
            self.moveTowards(this.movelist[0], this.distance);
        
        if (this.distance <= this.minDistance) {
            this.targetReached = true;
            this.movelist.shift(0);
        }
        
        if (this.targetReached || this.movelist.length === 0) {
            var localObjects = map.getLocalObjects(self);
            this.addMoveTarget(localObjects.random());
            this.targetReached = false;
        }
    }
}

class Hunting extends GameAI {
    constructor() {
        super(null, null, null);
        
    }
    
    loop(self, map) {
        super.loop(self);
        
        if (this.actionlist.length === 0) {
            this.addActionTarget(this.acquireTarget(self, map));
        }
        else if (!this.action) {
            this.actions = self.getActions("offensive");
            var ActionClass = this.actions.random();
            this.action = new ActionClass(self, [this.actiontarget], this);
            this.minDistance = this.action.minDistance;
        }
        else {

            this.distance = getDistance(self, this.actiontarget);

            if (this.distance > this.minDistance)
                self.moveTowards(this.actiontarget, this.distance);
            
            if (this.distance <= this.minDistance) {
                map.addAction(this.action);
            }
        }
    }
    
    acquireTarget(self, map) {
        var target = null;
        
        var localObjects = getLocalObjects(self, map);
        var targetList = [];

        localObjects.filter(function(o) {
            return o instanceof GameUnit &&
            o.team != self.team;
        }).forEach(function(o) {
            var possibleTarget = {
                "object": o,
                "distance": getDistance(self, o),
                "score": 0
            };
            targetList.push(possibleTarget);
        });
        
        if (targetList.length == 0)
            return null;

        targetList.sort(function(a,b) {
            return a.distance - b.distance;
        });

        console.log(targetList);

        //filter based on type
        //sort based on "score"
        //score comes from distance, hp left, unit type, etc.
        
        target = targetList[0].object;

        return target;
    }
}

class Attacking extends GameAI {
    constructor() {
        super(null, null, null);
    }
    
    loop(self, map) {
        super.loop(self);
        
        if (this.actiontarget) {
            this.movetarget = this.actiontarget;
            
            if (self.action) {
                self.action.invoke(this.distance);
            }
        }
    }
}

class Protecting extends GameAI {
    constructor() {

    }

    loop(self, map) {

    }
}

class Supporting extends GameAI {
    constructor() {

    }

    loop(self, map) {

    }
}