var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player,cursors;
var speed = 300;
var once = true;

function preload() {
  
  game.load.image('car', 'assets/car.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);

    player = game.add.sprite(200, 400, 'car');
    game.physics.p2.enable(player);
    cursors = game.input.keyboard.createCursorKeys();
    player.body.damping  = 0.997;

    // carru = game.add.sprite(200, 170, 'car');
    // game.physics.p2.enable(carru);
    // carru.body.angle = 200;
    // carru.body.damping  = 0.5;
    // carru.body.angularDamping  = 0.8;
 
}

function update() {
    speed = speed *player.body.damping
    if (cursors.left.isDown) {player.body.rotateLeft(speed/300*100);} 
    else if (cursors.right.isDown){player.body.rotateRight(speed/300*100);}
    else {player.body.setZeroRotation();}
    player.body.moveForward(speed)

    
}