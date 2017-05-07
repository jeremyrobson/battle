class GameUser {
    constructor(username) {
        this.team = username;
        this.x = 0;
        this.y = 0;
        this.party = new Party(5, 0, 0, this.team);
        this.movetarget = null;
    }
    
    loop() {
        this.move();
    }
    
    
    mouseDown(x, y, selobject) {
        this.party.mouseDown(x, y, selobject);
        
        this.movetarget = {
            "x": x,
            "y": y
        }
    }
    
    move() {
        if (this.movetarget) {
            var distance = getDistance(this, this.movetarget);
            
            if (distance > 1) {
                var angle = getAngle(this, this.movetarget);
                this.speed = clamp(distance / 10, 0, 3);
                this.x = this.x + Math.cos(angle) * this.speed;
                this.y = this.y + Math.sin(angle) * this.speed;
            }
        }

    }
}