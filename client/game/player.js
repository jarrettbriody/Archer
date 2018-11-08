//Jarrett Briody
//Project 2 player file

"use strict";

//player child class which inherits from gameobject
function Player(spriteID){
    GameObject.call(this,spriteID);
    this.maxAccel = 3;
    this.maxSpd = 6;
    this.negYBound = 0;
    this.posYBound = 670;
    this.negXBound = 0;
    this.gravityForce = new Vector2(0,0.3);
    this.isGravity = true;
    this.position.x = 500;
    this.position.y = 300;
}

//add all the following methods to the prototype so they are not copied every time a new player is made
Player.prototype = Object.assign({},GameObject.prototype);
Player.prototype.update = updatePlayer;
Player.prototype.checkBounds = checkPlayerBounds;
Player.prototype.die = die;
Player.prototype.move = move;
Player.prototype.jump = jump;

//basically an override of updateBase function for the player
function updatePlayer(){
    if(!this.dead){
        if(this.health <= 0){
            this.health = 0;
            this.die();
            this.dead = true;
        }
    }

    if(myKeys.keydown["w".charCodeAt(0)] || myKeys.keydown["W".charCodeAt(0)]){
		app.main.player.move("UP");
	}
	if(myKeys.keydown["a".charCodeAt(0)] || myKeys.keydown["A".charCodeAt(0)]){
		app.main.player.move("LEFT");
	}
	if(myKeys.keydown["s".charCodeAt(0)] || myKeys.keydown["S".charCodeAt(0)]){
		app.main.player.move("DOWN");
	}
	if(myKeys.keydown["d".charCodeAt(0)] || myKeys.keydown["D".charCodeAt(0)]){
		app.main.player.move("RIGHT");
	}
	if(myKeys.keydown[myKeys.KEYBOARD["KEY_SPACE"]]){
		app.main.player.jump();
	}
    //position
    this.updateBase();
    //this.checkBounds();
    
}

//check the bounds of the player and act accordingly
function checkPlayerBounds(){
    if(this.position.y < this.negYBound){
        this.position.y = this.negYBound;
        this.velocity.y = 0;
        this.rotation = 0;
        this.addForce(new Vector2(0,0.8));
        app.main.mouse.set(500,this.negYBound + 10);
    }
    if(this.position.y > this.posYBound){
        this.position.y = this.posYBound;
        this.rotation = 0;
        this.health -= this.velocity.magnitude() * 7;
        this.spark(this.position);
        //console.log(this.health);
        this.velocity.y = 0;
        this.addFriction(0.95);
        if(this.dead && Math.floor(Math.random() * 100 + 1) == 3) {
            this.explode("#explosionImg2",this.position.add(new Vector2(Math.random() * 30 - 15, Math.random() * 30 - 15)), new Vector2(-16,-16), 64, 4, 16); 
            app.main.sound.playEffect("explosion.wav", 1.0,false);
        }
        app.main.mouse.set(500,this.posYBound - 10);
    }
    if(this.position.x < this.negXBound){
        this.addForce(new Vector2(0.8,0));
        app.main.mouse.set(500,150);
    }
}

//helper function for when the player dies
function die(){
    this.explode("#explosionImg",this.position, new Vector2(-40,-40), 128, 8, 40);
    this.dead = true;                                         
    this.sprite = document.querySelector("#brokenA10Img");
    this.velocity = new Vector2(app.main.parallax.getFrontSpeed(),0);
    this.followMouse = false;
    this.isGravity = true;
    this.velocity = new Vector2(10,0);
    if(!this.lockedOnSound.paused) this.lockedOnSound.pause();
    if(!this.lockedOnToSound.paused) this.lockedOnToSound.pause();
}

function move(dir){
    switch(dir){
        case "UP":
        this.addForce(new Vector2(0,-1));
        break;
        case "LEFT":
        this.addForce(new Vector2(-1,0));
        break;
        case "DOWN":
        this.addForce(new Vector2(0,1));
        break;
        case "RIGHT":
        this.addForce(new Vector2(1,0));
        break;
        default:
        break;
    }
}

function jump(){
    this.addForce(new Vector2(0,-5));
}
