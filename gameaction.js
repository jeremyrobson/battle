class GameAction {
    constructor(actor, targets, ai) {
        this.actor = actor;
        this.target = targets;
        this.parentAI = ai; //might be able to get this from the actor anyway

    }

    invoke() {

    }
    
    loop() {
        
    }
    
    draw(ctx) {
        
    }
}

class Melee extends GameAction {
    constructor(actor, targets, ai) {
        super(actor, targets, ai);

        //this.type = "offensive";
        this.range = 1;
        this.animation = null;
        this.duration = 2;
        this.minDistance = 32;
        this.life = 2;
    }

    static getType() {
        return "offensive";
    }

    invoke() {
        console.log("melee");
    }

    loop() {
        this.invoke();
        this.life--;
        if (this.life <= 0) {
            this.done();
        }
    }

    draw(ctx) {

    }

    done() {
        this.parentAI.action = null;
    }
}