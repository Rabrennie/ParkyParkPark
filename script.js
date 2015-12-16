var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player,cursors, spriteMaterial;
var speed = 300;
var once = true;

function Car(x, y, startSpeed, rotation, friction, car, material) {
    this.car = game.add.sprite(x, y, car);
    this.car.scale.setTo(2.5,2.5)
    this.startSpeed = startSpeed;
    this.speed= startSpeed;
    game.physics.p2.enable(this.car)
    this.friction = friction;
    this.car.body.angularDamping = 0.9;
    this.car.body.damping = 0.5;
    this.car.body.mass = 0.1;
    this.car.body.rotation = rotation;
    this.car.body.onBeginContact.add(blockHit.bind(this), this.car);
    this.collision = false;
    this.car.body.setMaterial(material)
    this.car.body.moveForward(this.startSpeed)

    this.moveForward = function(){
        if (this.speed >= 25) {
            this.speed = this.speed * this.friction;
        } else if (this.speed >= 5){
            this.speed = this.speed * (this.friction-0.005);
            
        } else {
            this.speed = 0;
        }
        this.car.body.moveForward(this.speed);
    }
    this.rotateLeft = function(){
    
        this.car.body.rotateLeft(this.speed/this.startSpeed*100);
    }
    this.rotateRight = function(){
        
        this.car.body.rotateRight(this.speed/this.startSpeed*100);
    }
    this.setZeroRotation = function(){
        this.car.body.setZeroRotation();
    }
}

function preload() {
  
  game.load.image('car', 'assets/car.png');
  game.load.image('background', 'assets/background.png');

}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    this.car = game.add.sprite(0, 0, 'background');

    spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');

    player = new Car(100,200,300,20,0.997,'car', spriteMaterial);
    cursors = game.input.keyboard.createCursorKeys();
    new Car(200,200,300,20,0.997,'car', spriteMaterial);

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(spriteMaterial, true, true, true, true);

    //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
    //  those 2 materials collide it uses the following settings.
    //  A single material can be used by as many different sprites as you like.
    var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, spriteMaterial);

    contactMaterial.friction = 0.3;     // Friction to use in the contact of these two materials.
    contactMaterial.restitution = 0.5;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    contactMaterial.surfaceVelocity = 0; 

    // carru = game.add.sprite(200, 170, 'car');
    // game.physics.p2.enable(carru);
    // carru.body.angle = 200;
    // carru.body.damping  = 0.5;
    // carru.body.angularDamping  = 0.8;
    
}

function update() {
    if(!player.collision){
        
        if(player.speed == 0){
            player = new Car(100,200,300,20,0.997,'car', spriteMaterial);
        }
    } else {
        if(player.car.body.velocity.x<=0.5&&player.car.body.velocity.y<=0.5){
            player = new Car(100,200,300,20,0.997,'car', spriteMaterial);
        }
        player.speed = Math.sqrt(player.car.body.velocity.x*player.car.body.velocity.x+player.car.body.velocity.y*player.car.body.velocity.y);
    }
    player.moveForward();
    if (cursors.left.isDown) {player.rotateLeft()} 
    else if (cursors.right.isDown){player.rotateRight()}
    else {player.setZeroRotation()}

    

    
}

function blockHit (body, bodyB, shapeA, shapeB, equation) {

    //  The block hit something.
    //  
    //  This callback is sent 5 arguments:
    //  
    //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
    //  The p2.Body this Body is in contact with.
    //  The Shape from this body that caused the contact.
    //  The Shape from the contact body.
    //  The Contact Equation data array.
    //  
    //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.

    
    this.collision = true;
    if (body)
    {
        console.log(result = 'You last hit: ' + body.sprite.key);
    }
    else
    {
        console.log(result = 'You last hit: The wall :)');
    }

}