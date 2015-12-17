var renderer, stage, container, graphics, zoom,
            world, boxShape, boxBody, planeBody, planeShape,chassisBody,player, cars=[];

        var carTexture;

        var PLAYER=Math.pow(2,1),
            CAR=Math.pow(2,2);

        init();
        

        function Car(x,y,w,h,angle,velX,velY,mass,world,container,collisionGroup,stage){
            this.chassisBody = new p2.Body({
                position: [x,y],
                mass: mass,
                angle: angle,
                velocity: [velX, velY],
            });
            
            this.boxShape = new p2.Box({ width: w, height: h });
            this.boxShape.collisionGroup = collisionGroup;
            this.boxShape.collisionMask = PLAYER | CAR
            this.chassisBody.addShape(this.boxShape);
            world.addBody(this.chassisBody);
            // Create the vehicle
            this.vehicle = new p2.TopDownVehicle(this.chassisBody);
            // Add one front wheel and one back wheel - we don't actually need four :)

            this.chassisBody.frontWheel = this.vehicle.addWheel({
                localPosition: [0, 0.5] // front
            });

            this.chassisBody.frontWheel.setSideFriction(200);
            // Back wheel
            this.chassisBody.backWheel = this.vehicle.addWheel({
                localPosition: [0, -0.5] // back
            });
            this.chassisBody.backWheel.setSideFriction(200); // Less side friction on back wheel makes it easier to drift
            this.vehicle.addToWorld(world);

            this.graphics = new PIXI.Graphics();
            this.graphics.beginFill(0xff0000);
            this.texture = carTexture;
            this.sprite = new PIXI.Sprite(this.texture);
            this.graphics.addChild(this.sprite);
            this.graphics.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);
            this.sprite.width = -this.boxShape.width;
            this.sprite.height = -this.boxShape.height;
            this.sprite.position={x:-this.boxShape.width/2, y:this.boxShape.height/2}
            this.sprite.scale.x = -this.sprite.scale.x
            // Add the box to our container
            container.addChild(this.graphics);

            this.update = function(){
                this.graphics.position.x = this.chassisBody.position[0];
                this.graphics.position.y = this.chassisBody.position[1];
                this.graphics.rotation =   this.chassisBody.angle;
            }
        }

        function init(){

            // Init p2.js
            // Create a dynamic body for the chassis
            world = new p2.World({
                gravity : [0,0]
            });

            zoom = 50;

            // Initialize the stage
            renderer =  PIXI.autoDetectRenderer(800, 600),
            stage = new PIXI.Stage(0xFFFFFF);
            container = new PIXI.Container(),
            PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
            PIXI.loader
                        .add('car', 'assets/car.png')
                        .load(function (loader, resources) {
                            carTexture = resources.car.texture;
                            player = new Car(0,0,0.5,1,-1.5,15,0,2,world,container,PLAYER,stage);
                            animate();
            });
            stage.addChild(container);
            document.body.appendChild(renderer.view);
            // Add transform to the container
            container.position.x =  renderer.width/10; // center at origin
            container.position.y =  renderer.height/10;
            container.scale.x =  zoom;  // zoom in
            container.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"
            

            

            world.on("impact",function(evt){
                console.log(evt)
                var bodyA = evt.bodyA,
                bodyB = evt.bodyB;
                bodyA.frontWheel.setSideFriction(2);
                bodyB.frontWheel.setSideFriction(2);

                bodyA.backWheel.setSideFriction(2);
                bodyB.backWheel.setSideFriction(2);
            });0


            
            // Draw the box.
            

            var keys = {
                '37': 0, // left
                '39': 0, // right
                '38': 0, // up
                '40': 0 // down
            };
            var maxSteer = 20000;
            window.addEventListener("keydown",function (evt){
                keys[evt.keyCode] = 1;
                onInputChange();
            });
            window.addEventListener("keyup",function (evt){
                keys[evt.keyCode] = 0;
                onInputChange();
            });
            function onInputChange(){
                // Steer value zero means straight forward. Positive is left and negative right.
                player.chassisBody.frontWheel.steerValue = maxSteer * (keys[37] - keys[39]);
                player.chassisBody.backWheel.setBrakeForce(0);
                if(keys[40]){
                    if(player.chassisBody.backWheel.getSpeed() > 0.1){
                        // Moving forward - add some brake force to slow down
                        player.chassisBody.backWheel.setBrakeForce(2);
                    } else {
                        // Moving backwards - reverse the engine force
                        player.chassisBody.backWheel.setBrakeForce(2);
                    }
                }
            }
        }

        // Animation loop
        function animate(t){
            t = t || 0;
            requestAnimationFrame(animate);

            // Move physics bodies forward in time
            world.step(1/60);

            // Transfer positions of the physics objects to Pixi.js
            
            player.update();
            for (var i = cars.length - 1; i >= 0; i--) {
                cars[i].update()
            };
            // console.log(p2.vec2.length(player.chassisBody.velocity))
            if(p2.vec2.length(player.chassisBody.velocity) <= 0.05){
                player.chassisBody.backWheel.setBrakeForce(2);
                player.boxShape.collisionGroup = CAR;
                cars.push(player);
                player = new Car(0,0,0.5,1,-1.5,15,0,2,world,container,PLAYER,stage);
                
            }
            // Render scene
            renderer.render(stage);
        }