var unittypes = {
    "Human": {
        "sprite": 0x1F601,
        "actions": [Melee]
    },
    "Snek": {
        "sprite": 0x1F40D,
        "actions": [Melee]
    }
};

class GameUnit extends GameSprite {
    constructor(type, x, y, size, color, sprite, ai, team) {
        super(type, x, y, size, color, sprite);

        this.ai = ai;
        this.team = team;
        this.moveTowards = moveTowards.bind(this);
        this.moveAwayFrom = moveAwayFrom.bind(this);
        this.minDistance = null;

        var unittemplate = clone(unittypes[type]);
        this.sprite = String.fromCodePoint(unittemplate.sprite);
        this.actions = unittemplate.actions;
    }
    
    loop(map) {
        if (this.action) {
            this.minDistance = this.action.range;
        }
        else
            this.minDistance = 1;
        
        this.ai.loop(this, map);
        
        this.qx = Math.floor(this.x / QUAD_WIDTH);
        this.qy = Math.floor(this.y / QUAD_HEIGHT);
    }
    
    draw(ctx,offsetx=0,offsety=0) {
        var dx = this.x - offsetx - 16;
        var dy = this.y - offsety - 16;
        
        ctx.fillStyle = this.color.toString();
        ctx.font = this.size + "px Arial";
        ctx.textBaseline = "top";
        ctx.fillText(this.sprite,dx,dy);
    }
    
    addMoveTarget(movetarget) {
        this.ai.addMoveTarget(movetarget);
    }

    getActions(type) {
        var actions = this.actions.filter(function(a) {
            return a.getType() === type;
        });
        return actions;
    }
}

class Party {
    constructor(count, x=0, y=0, team) {
        this.team = team;
        this.units = [];
        this.x = x;
        this.y = y;
        
        for (var i=0; i<count; i++) {
            var followtarget = this.units[i-1];
            
            var newunit = new GameUnit(
                "Human",
                x,
                y,
                24,
                new Color(255,255,0,1),
                null,
                new Following(followtarget),
                this.team
            );
            
            this.units.push(newunit);
        }
    }
    
    loop() {
        this.units.forEach(function(u) {
           u.loop(); 
        });
    }
    
    move() {

    }
    
    mouseDown(x, y, selobject) {
        var movetarget = {
            "x": x,
            "y": y
        };
        
        if (selobject)
            movetarget = selobject;
        
        this.units[0].addMoveTarget(movetarget);
    }
    
    draw(ctx,offsetx=0,offsety=0) {
        this.units.forEach(function(u) {
           u.draw(ctx,offsetx,offsety); 
        });
    }
}