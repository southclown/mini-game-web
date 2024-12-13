class Laser {
    constructor(x, y, direction, color) {
        this.width = 20;
        this.height = 5;
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.direction = direction;
        this.color = color;
        this.active = true;
    }

    update() {
        this.x += this.speed * this.direction;
    }

    draw(ctx) {
        if (!this.active) return;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        if (!this.active || player.isDead) return false;

        return (this.x < player.position.x + player.width &&
                this.x + this.width > player.position.x &&
                this.y < player.position.y + player.height &&
                this.y + this.height > player.position.y);
    }
}
