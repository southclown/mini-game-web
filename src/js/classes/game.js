class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player({
            x: 100,
            y: this.canvas.height / 2,
            width: 50,
            height: 50,
            speed: 5,
            color: '#00ff00',
            isEnemy: false
        });
        
        this.enemy = new Player({
            x: this.canvas.width - 100,
            y: this.canvas.height / 2,
            width: 50,
            height: 50,
            speed: 5,
            color: '#ff0000',
            isEnemy: true
        });

        this.isGameRunning = false;
        this.bindEvents();

        // Tambahkan kontrol untuk menembak
        this.controls = {
            player: {
                shoot: 'Space'
            },
            enemy: {
                shoot: 'ShiftLeft'
            }
        };

        // Pastikan canvas memiliki ukuran yang benar
        this.canvas.width = 800;  // Sesuaikan dengan kebutuhan
        this.canvas.height = 600; // Sesuaikan dengan kebutuhan
        
        // Tambahkan referensi canvas ke window agar bisa diakses global
        window.canvas = this.canvas;
        window.board = this.ctx;
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleInput(e));
        document.addEventListener('keyup', (e) => this.handleInput(e));
    }

    handleInput(event) {
        // Handle player input
        if (!this.isGameRunning) return;
        
        if (event.type === 'keydown') {
            switch(event.code) {
                case 'ArrowUp':
                    this.player.moveUp();
                    break;
                case 'ArrowDown':
                    this.player.moveDown();
                    break;
                case 'ArrowLeft':
                    this.player.moveLeft();
                    break;
                case 'ArrowRight':
                    this.player.moveRight();
                    break;
                case 'Space':
                    this.player.shoot();
                    break;
                case 'ShiftLeft':
                    this.enemy.shoot();
                    break;
            }
        }
    }

    start() {
        this.isGameRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isGameRunning) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update dan draw
        this.player.update();
        this.enemy.update();
        
        // Draw player dan enemy
        this.player.create();
        this.enemy.create();

        // Cek collision laser
        this.checkLaserCollisions();

        // Cek collision antara player dan enemy
        this.player.checkCollision(this.enemy);
        this.enemy.checkCollision(this.player);

        // Cek apakah ada yang kalah
        if (this.player.isDead || this.enemy.isDead) {
            const winner = this.player.isDead ? "Enemy" : "Player";
            console.log(`Game Over! ${winner} Wins!`);
            this.isGameRunning = false;
            this.showGameOver(winner);
            return;
        }

        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }

    showGameOver(winner) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Game Over! ${winner} Wins!`, this.canvas.width/2, this.canvas.height/2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Tekan SPACE untuk main lagi', this.canvas.width/2, this.canvas.height/2 + 50);
    }

    reset() {
        this.player.reset();
        this.enemy.reset();
        this.isGameRunning = false;
    }

    checkLaserCollisions() {
        // Cek laser player mengenai enemy
        this.player.lasers.forEach(laser => {
            if (laser.checkCollision(this.enemy)) {
                const damage = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
                this.enemy.takeDamage(damage);
                laser.active = false;
                console.log(`Player laser hit! Enemy takes ${damage} damage`);
            }
        });

        // Cek laser enemy mengenai player
        this.enemy.lasers.forEach(laser => {
            if (laser.checkCollision(this.player)) {
                const damage = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
                this.player.takeDamage(damage);
                laser.active = false;
                console.log(`Enemy laser hit! Player takes ${damage} damage`);
            }
        });
    }
}