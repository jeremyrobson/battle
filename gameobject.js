var mapobjects = {
    "Tree1": {
        "code": 0x1F332
    },
    "Tree2": {
        "code": 0x1F333
    }
};

var maptypes = {
    "world": {
        "objecttypes": ["tree1", "tree2"]
    }
};

class GameObject {
    constructor(type, x, y, size, color = "rgba(255,255,255,1.0)") {
        this.id = guid();
        this.type = type;
        
        this.x = x;
        this.y = y;
        this.qx = Math.floor(this.x / QUAD_WIDTH);
        this.qy = Math.floor(this.y / QUAD_HEIGHT);
        this.lqx = this.qx;
        this.lqy = this.qy;
        this.speed = 0.1;
        this.color = color;
        this.size = size;
        this.remove = false;
    }
    
    loop() {
        
    }

    draw(ctx, offsetx, offsety) {

    }

    dispose() {
        this.remove = true;
    }
}

class GameSprite extends GameObject {
    constructor(type, x, y, size, color, sprite) {
        super(type, x, y, size, color);

        this.sprite = sprite;
    }

    draw(ctx, offsetx, offsety) {
        var dx = this.x - offsetx - 16;
        var dy = this.y - offsety - 16;
        ctx.fillStyle = this.color;
        ctx.font = this.size + "px Arial";
        ctx.fillText(this.sprite, dx, dy);
    }

}

class TextBall extends GameObject {
    constructor(x, y, size, color, text) {
        super("TextBall", x, y, size, color);

        this.initialY = y;
        this.vy = -2;
        this.momentum = 0.1;
        this.text = text;
    }

    loop() {
        this.color.a -= 0.005;

        this.vy += this.momentum;
        this.y += this.vy;
        if (this.y > this.initialY) {
            this.y = this.initialY;
            this.vy = -this.vy;
        }
        if (this.color.a <= 0)
            this.dispose();
    }

    draw(ctx, offsetx, offsety) {
        var dx = this.x - offsetx - 16;
        var dy = this.y - offsety - 16;
        ctx.font = this.size + "px Monospace";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineWidth = 1;
        ctx.strokeText(this.text, dx, dy);
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, dx, dy);
    }

}