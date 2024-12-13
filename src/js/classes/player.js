class Player {
    constructor(property) {
        this.width = property.width;
        this.height = property.height;
        this.speed = property.speed;
        this.position = {
            x: property.x || 0,
            y: property.y || 0
        };
        this.color = property.color;
        
        // Tambahan properti untuk lompat
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpForce = -15;
        this.isJumping = false;

        // Tambahan properti untuk kontrol gerakan
        this.keys = {
            left: false,
            right: false
        };

        // Tambahan properti untuk memantul
        this.horizontalVelocity = 0;
        this.bounceForce = 0.5; // Kekuatan pantulan (0-1)

        // Tambahan properti untuk sistem HP
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.isDead = false;
        this.isEnemy = property.isEnemy || false; // Untuk membedakan player dan enemy

        // Tambahan properti untuk laser
        this.lasers = [];
        this.lastShootTime = 0;
        this.shootCooldown = 500; // Cooldown menembak dalam milidetik
    }

    create() {
        if (this.isDead) return;

        // Draw player
        board.fillStyle = this.color;
        board.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Draw lasers
        this.lasers.forEach(laser => {
            laser.draw(board);
        });
        
        this.drawHealthBar();
    }

    update() {
        if (this.isDead) return; // Skip update jika sudah mati

        // Terapkan gravitasi
        this.velocity += this.gravity;
        this.position.y += this.velocity;

        // Update gerakan horizontal berdasarkan state keys
        if (this.keys.left) this.horizontalVelocity = -this.speed * 2;
        if (this.keys.right) this.horizontalVelocity = this.speed * 2;
        
        // Terapkan gerakan horizontal
        this.position.x += this.horizontalVelocity;

        // Batasi player di tembok kanan
        if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width;
            this.horizontalVelocity = -this.horizontalVelocity * this.bounceForce;
        }
        
        // Batasi player di tembok kiri
        if (this.position.x < 0) {
            this.position.x = 0;
            this.horizontalVelocity = -this.horizontalVelocity * this.bounceForce;
        }

        // Batasi player di atap
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity = -this.velocity * this.bounceForce; // Pantulkan ke bawah
        }

        // Batasi player agar tidak jatuh melewati batas bawah canvas
        if (this.position.y + this.height > canvas.height) {
            this.position.y = canvas.height - this.height;
            this.velocity = 0;
            this.isJumping = false;
        }

        // Perlambat gerakan horizontal
        this.horizontalVelocity *= 0.95; // Friction/gesekan

        // Update lasers
        this.lasers = this.lasers.filter(laser => {
            laser.update();
            // Hapus laser yang keluar dari canvas
            return laser.x > 0 && laser.x < canvas.width && laser.active;
        });
    }

    jump() {
        if (!this.isJumping) {
            this.velocity = this.jumpForce;
            this.isJumping = true;
        }
    }

    // Tambahan method untuk sistem damage
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }

    // Method untuk mengecek collision dengan karakter lain
    checkCollision(other) {
        if (this.isDead || other.isDead) return;

        // Perbaiki deteksi collision yang lebih akurat
        const isOnTop = this.position.y + this.height <= other.position.y + 5 && // Kurangi toleransi menjadi 5
                       this.velocity >= 0 && // Pastikan karakter sedang turun
                       this.position.x + this.width >= other.position.x &&
                       this.position.x <= other.position.x + other.width;

        if (isOnTop) {
            console.log('Hit detected!'); // Tambah kan log untuk debugging
            const damage = Math.floor(Math.random() * (12 - 7 + 1)) + 7;
            other.takeDamage(damage);
            console.log(`Damage dealt: ${damage}, Enemy HP: ${other.health}`); // Log damage
            
            // Buat karakter yang di atas memantul lebih tinggi
            this.velocity = this.jumpForce / 1.5; // Tingkatkan pantulan
            this.isJumping = true;
        }
    }

    // Method untuk menggambar HP bar
    drawHealthBar() {
        const barWidth = 50;
        const barHeight = 5;
        const healthPercentage = this.health / this.maxHealth;
        
        // Background HP bar (merah)
        board.fillStyle = 'red';
        board.fillRect(
            this.position.x, 
            this.position.y - 10, 
            barWidth, 
            barHeight
        );
        
        // Foreground HP bar (hijau)
        board.fillStyle = 'green';
        board.fillRect(
            this.position.x, 
            this.position.y - 10, 
            barWidth * healthPercentage, 
            barHeight
        );
    }

    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShootTime < this.shootCooldown) return;

        const laserX = this.isEnemy ? 
            this.position.x : 
            this.position.x + this.width;
        
        const laserY = this.position.y + (this.height / 2);
        const direction = this.isEnemy ? -1 : 1;
        const laserColor = this.isEnemy ? '#ff0000' : '#00ff00';

        const laser = new Laser(laserX, laserY, direction, laserColor);
        this.lasers.push(laser);
        this.lastShootTime = currentTime;
        
        console.log('Laser ditembakkan!', {
            position: {x: laserX, y: laserY},
            direction,
            color: laserColor
        });
    }
}