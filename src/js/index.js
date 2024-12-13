const canvas = document.querySelector("canvas");
const board = canvas.getContext("2d");


canvas.width = DISPLAY_PIXEL.width;
canvas.height = DISPLAY_PIXEL.height;

window.addEventListener('resize', () => {
    DISPLAY_PIXEL.width = window.innerWidth;
    DISPLAY_PIXEL.height = window.innerHeight;
    canvas.width = DISPLAY_PIXEL.width;
    canvas.height = DISPLAY_PIXEL.height;
    
    // Re-render elemen yang ada
    ground.create();
});

const playerProperty = {
    width: 50,
    height: 50,
    speed: 10,
    color: "tomato",
    position: {
        x: 0,
        y: 0
    }
}

const enemyProperty = {
    width: 50,
    height: 50,
    speed: 10,
    color: "black",
    position: {
        x: canvas.width - 50,
        y: canvas.height - 50
    }
}


const ground = new Ground('src/assets/bg.jpg',canvas.width, canvas.height);
const player = new Player(playerProperty);
const enemy = new Player(enemyProperty);

function animate() {
    ground.create();
    player.create();
    enemy.create();
    player.update();
    enemy.update();
    window.requestAnimationFrame(animate);
}

window.addEventListener('keydown', function(callback){
    switch(callback.key){
        case "ArrowUp":
            player.jump();
            break;
        case "ArrowLeft":
            player.keys.left = true;
            break;
        case "ArrowRight":
            player.keys.right = true;
            break;
        default:
            break;
    }
});

window.addEventListener('keyup', function(callback){
    switch(callback.key){
        case "ArrowLeft":
            player.keys.left = false;
            break;
        case "ArrowRight":
            player.keys.right = false;
            break;
        default:
            break;
    }
});

animate();
