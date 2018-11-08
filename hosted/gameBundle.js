//Jarrett Briody
//Project 2 Classes file

"use strict";

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   Generic Particle                   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function Particle(spriteID) {
    var pos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var vel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var angVel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var scale = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var time = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -1;
    var fade = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var isGravity = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

    GameObject.call(this, spriteID);
    this.timeOut = time;
    this.timeOutStartTime = Date.now();
    this.isFading = fade;
    this.angularVelocity = angVel;
    this.position = pos;
    this.position = this.position.add(new Vector2(-this.sprite.width / 2, this.sprite.height / 2));
    this.maxSpd = 20;
    this.velocity = vel;
    this.isGravity = isGravity;
    this.scale = scale;
}

Particle.prototype = Object.assign({}, GameObject.prototype);
Particle.prototype.update = updateParticle;
Particle.prototype.smoke = smoke;

//simple override of updateBase
function updateParticle() {
    this.updateBase();
    if (this.spriteID == "#scarImg" && this.position.x < -20) {
        this.dead = true;
    }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   Bullet                   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Bullet(spriteID) {
    GameObject.call(this, spriteID);
    //this.collided = false;
    this.maxSpd = 1000;
    this.tracerScale = 1;
}

Bullet.prototype = Object.assign({}, GameObject.prototype);
Bullet.prototype.update = updateProjectile;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   Universal Functions                   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//updateBase override for a tank or tunguska
function updateGroundVehicle() {
    this.updateBase();
    this.inBounds = this.checkBounds();
    if (this.inBounds && this.frameCount % 1 == 0) {
        var newSmoke = new Particle("#smokeImg", this.position.add(new Vector2(Math.random() * this.sprite.width * 3 / 4, this.sprite.height / 2 + (Math.random() * 3 - 1.5) - 10)), new Vector2(app.main.parallax.getFrontSpeed(), Math.random() * -0.5), Math.random() * 0.2, new Vector2(0.5, 0.5), 500, true, false);
        app.main.particles.push(newSmoke);
    }
    if (this.inBounds && this.fires && !this.dead) {
        if (this.missileTimeOut > 0.0) {
            if (this.missileTimeOut <= Date.now() - this.missileTimeOutStartTime) {
                this.missileTimeOut = 0.0;
            }
        } else {
            this.fire();
        }
    }
    if (this.vSound && this.inBounds) {
        var newVol = (1 - app.main.player.position.subtract(this.position).magnitude() / (app.main.width - 100)) * 0.5;
        if (newVol > 1) newVol = 1;else if (newVol < 0) newVol = 0;
        this.vSound.volume = newVol;
        if (this.vSound.currentTime >= this.vSound.duration - 0.1) {
            this.vSound.currentTime = 0;
        }
    }
    if (this.inBounds && this.vSound.paused) {
        this.vSound.play();
    }
    if (this.dead && !this.vSound.paused) {
        this.vSound.pause();
    }
}

//check to see if the enemy has passed the player, if so then kill it
function checkEnemyBounds() {
    if (this.position.x < this.negXBound) {
        this.dead = true;
        return false;
    }
    return this.position.x < this.posXBound;
}

//explode helper function
function explode(spriteID, pos, offset, frameWidth, rowCount, endIndex) {
    var newExplosion = new Explosion(spriteID, pos, offset, frameWidth, rowCount, endIndex);
    app.main.explosions.push(newExplosion);
}

//spark helper function
function spark(pos) {
    var numOfSparks = Math.floor(Math.random() * 2) + 1;
    for (var i = 0; i < numOfSparks; i++) {
        var pos1 = pos;
        var pos2 = pos1.add(new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1).multiplyScalar(Math.random() * 5 + 10));
        app.main.sparks.push({
            start: pos1,
            end: pos2,
            alpha: 0.5,
            color: app.main.sparkColors[Math.floor(Math.random() * 5)]
        });
    }
}

//smoke helper function
function smoke(pos, vel, rot, scale) {
    var newSmoke = new Particle("#smoke2Img", pos, vel, rot, new Vector2(1, 1).multiplyScalar(scale), 1000, true, false);
    app.main.particles.push(newSmoke);
}

//updateBase override for projectiles like missiles and bullets
function updateProjectile() {
    this.updateBase();
    if (this.inBounds) {
        var posYBound = 670;
        if (this.position.y > posYBound) {
            this.dead = true;
            var scaleVec = Math.random() * 0.5 + 0.5;
            var newSmoke = new Particle("#smokeImg", this.position.copy(), new Vector2(app.main.parallax.getFrontSpeed(), -0.2), 0.05, new Vector2(scaleVec, scaleVec), 1000, true, false);
            app.main.particles.push(newSmoke);

            scaleVec = Math.random() * 1 + 0.5;
            var rand = Math.floor(Math.random() * 6);
            for (var i = 0; i < rand; i++) {
                var newRock = new Particle("#rockImg", this.position.copy(), new Vector2(Math.floor(Math.random() * -11), Math.random() * -3), Math.random() * 0.2 - 0.1, new Vector2(scaleVec, scaleVec), 500, true, true);
                app.main.particles.push(newRock);
            }

            var newScar = new Particle("#scarImg", this.position.subtract(new Vector2(4, 0)), new Vector2(app.main.parallax.getFrontSpeed(), 0), 0, new Vector2(1, 1), -1, true, false);
            app.main.roadScars.push(newScar);
        }
    } else this.dead = true;
}
//Jarrett Briody
//Project 2 gameobject file

"use strict";

//gameobject parent class for every gameobject

function GameObject() {
    var spriteID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#NULL";

    this.health = 100;
    this.position = new Vector2();
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
    this.scale = new Vector2(1, 1);
    this.angularVelocity = 0;
    this.rotation = 0;
    this.maxSpd = 5;
    this.maxAccel = 10;
    this.sprite = document.querySelector(spriteID);
    this.timeOut = -1;
    this.isFading = false;
    this.alpha = 1;
    this.timeOutStartTime = -1;
    this.dead = false;
    this.frameCount = 0;
    this.inBounds = false;
    this.spriteID = spriteID;
    this.isGravity = false;
    this.gravityForce = new Vector2(0, 0.1);
    this.negXBound = 0;
    this.posXBound = app.main.width;
    this.negYBound = 0;
    this.posYBound = app.main.height;
    if (this.sprite) {
        this.negXBound = 0 - this.sprite.width - 50;
        this.posXBound = app.main.width + 50;
        this.negYBound = 0 - this.sprite.height - 50;
        this.posYBound = app.main.height + 50;
    }
}

//add all the following methods to the prototype so they are not copied every time a new gameobject is made
GameObject.prototype.updateBase = updateBase;
GameObject.prototype.addForce = addForce;
GameObject.prototype.addFriction = addFriction;
GameObject.prototype.seek = seek;
GameObject.prototype.seekX = seekX;
GameObject.prototype.seekY = seekY;
GameObject.prototype.calcPos = calcPos;
GameObject.prototype.checkBoundsBase = checkBoundsBase;
GameObject.prototype.draw = draw;
GameObject.prototype.handleTimeOut = handleTimeOut;
GameObject.prototype.handleFade = handleFade;
GameObject.prototype.updateRot = updateRot;
GameObject.prototype.updateTrail = updateTrail;
GameObject.prototype.drawTrail = drawTrail;

//base update method for a gameobject
function updateBase() {
    if (this.isGravity) this.addForce(this.gravityForce);
    this.calcPos();
    if (this.sprite) this.checkBoundsBase();
    if (this.angularVelocity != 0) this.updateRot();
    if (this.timeOut != -1) this.handleTimeOut();
    if (this.timeOut != -1 && this.isFading) this.handleFade();
    this.frameCount++;
}

//add force for this update
function addForce(forceVector) {
    this.acceleration = this.acceleration.add(forceVector);
}

//add friction for this update
function addFriction() {
    var coefficient = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.95;

    var velMag = this.velocity.magnitude();
    var normVelocity = this.velocity.normalized();
    var scaledForce = normVelocity.multiplyScalar(-1 * velMag * (1 - coefficient));
    this.addForce(scaledForce);
}

//return a seek force using a seeking algorithm
function seek(targetPos) {
    var w = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

    var desiredVelocity = targetPos.subtract(this.position);
    desiredVelocity = desiredVelocity.normalized();
    desiredVelocity = desiredVelocity.multiplyScalar(this.maxSpd);
    var steeringForce = desiredVelocity.subtract(this.velocity);
    return steeringForce.multiplyScalar(w);
}

//return a seek force purely in x direction
function seekX(targetPos) {
    var w = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

    var desiredVelocity = new Vector2(targetPos.x - this.position.x, 0);
    desiredVelocity.x *= app.main.dt * w / 1000;
    return desiredVelocity;
}

//return a seek force purely in y direction
function seekY(targetPos) {
    var w = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

    var desiredVelocity = new Vector2(0, targetPos.y - this.position.y);
    desiredVelocity.y *= app.main.dt * w / 1000;
    return desiredVelocity;
}

//calculate the new position for this update
function calcPos() {
    this.acceleration.clampMagnitude(this.maxAccel);
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity.clampMagnitude(this.maxSpd);
    var tempMagnitude = this.velocity.magnitude();
    if (tempMagnitude < 0.01) this.velocity.zeroOut();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //this.checkBounds();
    this.acceleration.zeroOut();
}

//base check bounds method for all game objects
function checkBoundsBase() {
    if (this.position.x > this.negXBound && this.position.x < this.posXBound && this.position.y > this.negYBound && this.position.y < this.posYBound) {
        this.inBounds = true;
    } else this.inBounds = false;
}

//the this gameobject has a timeout, update it
function handleTimeOut() {
    if (this.timeOut <= Date.now() - this.timeOutStartTime) {
        this.timeOut = -1;
        this.dead = true;
    }
}

//if this gameobject is fading, update it
function handleFade() {
    this.alpha = 1 - (Date.now() - this.timeOutStartTime) / this.timeOut;
}

//if this gameobject has an angular velocity, rotate it
function updateRot() {
    this.rotation += this.angularVelocity;
}

//if this gameobject is a jet, give it a trail
function updateTrail(trailList, offset, reverseDir) {
    if (this.frameCount % 1 == 0 && this.inBounds) {
        var newVertex = new GameObject("#pointImg");
        newVertex.position = this.position.add(new Vector2(Math.cos(this.rotation), Math.sin(this.rotation)).multiplyScalar(-30));
        newVertex.position = newVertex.position.add(offset);
        newVertex.maxSpd = 100;
        newVertex.timeOut = 750;
        newVertex.timeOutStartTime = Date.now();
        newVertex.posXBound = app.main.width + 300;
        newVertex.negXBound = -300;
        //if(pScale < 1) newVertex.velocity = this.velocity.add(new Vector2(app.main.parallax.getFrontSpeed(),0));
        //if(pScale > 0) newVertex.velocity = this.velocity.add(new Vector2(10 / app.main.parallax.getFrontSpeed() + app.main.parallax.getFrontSpeed(),0));
        //newVertex.velocity = this.velocity.add(new Vector2(-10,0));
        if (reverseDir) newVertex.velocity = new Vector2(this.velocity.x + 5, 0);else newVertex.velocity = new Vector2(this.velocity.x - 10, 0); //new Vector2(app.main.parallax.getFrontSpeed() + this.velocity.x,0);

        newVertex.velocity.y = 0;
        trailList.push(newVertex);
    }
}

//draw the trail if the object is a jet
function drawTrail(trailList, ctx) {
    if (trailList.length > 0) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        trailList[trailList.length - 1].updateBase();
        ctx.beginPath();
        ctx.moveTo(trailList[trailList.length - 1].position.x, trailList[trailList.length - 1].position.y);
        for (var i = trailList.length - 1; i >= 1; i--) {
            trailList[i - 1].updateBase();
            if (trailList[i - 1].dead) {
                trailList.splice(i - 1, 1);
            } else {
                ctx.lineTo(trailList[i - 1].position.x, trailList[i - 1].position.y);
            }
        }
        ctx.stroke();
        ctx.restore();
    }
}

//draw the gameobject itself
function draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.position.x + this.sprite.width / 2, this.position.y + this.sprite.height / 2);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale.x, this.scale.y);
    ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);
    ctx.restore();
}
//Jarrett Briody
//Project 2 keys file

"use strict";

var myKeys = {};

myKeys.KEYBOARD = Object.freeze({
	"KEY_LEFT": 37,
	"KEY_UP": 38,
	"KEY_RIGHT": 39,
	"KEY_DOWN": 40,
	"KEY_SPACE": 32,
	"KEY_SHIFT": 16
});

myKeys.keydown = [];

// event listeners
window.addEventListener("keydown", function (e) {
	var char = String.fromCharCode(e.keyCode);
	myKeys.keydown[e.keyCode] = true;
});

window.addEventListener("keyup", function (e) {
	myKeys.keydown[e.keyCode] = false;

	// pausing and resuming
	var char = String.fromCharCode(e.keyCode);
	if (char == "p" || char == "P") {
		if (app.main.paused) {
			app.main.resumeGame();
		} else {
			app.main.pauseGame();
		}
	}
	//flares
	if (char == "f" || char == "F") {
		app.main.player.popFlares();
	}
});
//Jarrett Briody
//Project 2 Loader

"use strict";

var app = app || {};

//when the entire page loads, set modules and run inits
window.onload = function () {
	//app.sound.init();
	//app.main.sound = app.sound;
	app.main.init();
};
"use strict";

var app = app || {};

app.main = {
    canvas: undefined,
    ctx: undefined,
    player: undefined,
    background: undefined,
    blocks: [],
    blocksPos: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    mouse: undefined,
    frameCount: 0,
    width: 1280,
    height: 720,
    lastTime: undefined,
    dt: 0,
    baseBlockScale: 0.62,
    blockScale: undefined,

    //call initial function, only run once
    init: function init() {
        this.canvas = document.querySelector("#baseCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.canvas.style.cursor = "crosshair";
        this.mouse = new Vector2(500, 150);
        this.canvas.oncontextmenu = function () {
            return false;
        };
        this.canvas.onmousemove = this.checkMousePos.bind(this); //get new mouse pos
        this.canvas.onmousedown = this.checkMouseButtonClicks.bind(this); //check what mouse button was pressed
        //this.canvas.onmouseup = (function(){ if(!this.isReady) this.isReady = true; }).bind(this);
        this.lastTime = Date.now();
        this.background = new GameObject("#backgroundImg");
        this.player = new Player("#playerImg");
        this.blockScale = document.querySelector("#blockImg").width * this.baseBlockScale;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 20; j++) {
                if (this.blocksPos[i * 20 + j] === 1) {
                    var block = new GameObject("#blockImg");
                    block.scale.x = this.baseBlockScale;
                    block.scale.y = this.baseBlockScale;
                    block.position.x = j * this.blockScale;
                    block.position.y = i * this.blockScale;
                    this.blocks.push(block);
                }
            }
        }
        this.update();
    },

    //update method called 60 times per second, or as close as possible
    update: function update() {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.dt = Date.now() - this.lastTime;
        this.lastTime = Date.now();
        this.background.updateBase();
        this.player.update();
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].updateBase();
            var v = shortestVecOutOfBox(this.player.position.x, this.player.position.y, this.player.sprite.width, this.player.sprite.height, this.blocks[i].position.x, this.blocks[i].position.y, this.blocks[i].sprite.width * this.blockScale, this.blocks[i].sprite.height * this.blockScale);
            if (v != null) {
                console.dir(v);
                this.player.position.add(v);
            }
        }
        this.draw();
        this.frameCount++;
    },

    checkMouseButtonClicks: function checkMouseButtonClicks(e) {
        switch (e.button) {
            case 0:

                break;
            case 1:

                break;
            case 2:

                break;
            default:
                break;
        }
        return;
    },

    //get a vector of the current mouse pos relative to the canvas
    checkMousePos: function checkMousePos(e) {
        this.mouse = getMouse(e);
    },

    draw: function draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.background.draw(this.ctx);
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].draw(this.ctx);
        }
        this.player.draw(this.ctx);
    }
};
//Jarrett Briody
//Project 2 player file

"use strict";

//player child class which inherits from gameobject

function Player(spriteID) {
    GameObject.call(this, spriteID);
    this.maxAccel = 3;
    this.maxSpd = 6;
    this.negYBound = 0;
    this.posYBound = 670;
    this.negXBound = 0;
    this.gravityForce = new Vector2(0, 0.3);
    this.isGravity = true;
    this.position.x = 500;
    this.position.y = 300;
}

//add all the following methods to the prototype so they are not copied every time a new player is made
Player.prototype = Object.assign({}, GameObject.prototype);
Player.prototype.update = updatePlayer;
Player.prototype.checkBounds = checkPlayerBounds;
Player.prototype.die = die;
Player.prototype.move = move;
Player.prototype.jump = jump;

//basically an override of updateBase function for the player
function updatePlayer() {
    if (!this.dead) {
        if (this.health <= 0) {
            this.health = 0;
            this.die();
            this.dead = true;
        }
    }

    if (myKeys.keydown["w".charCodeAt(0)] || myKeys.keydown["W".charCodeAt(0)]) {
        app.main.player.move("UP");
    }
    if (myKeys.keydown["a".charCodeAt(0)] || myKeys.keydown["A".charCodeAt(0)]) {
        app.main.player.move("LEFT");
    }
    if (myKeys.keydown["s".charCodeAt(0)] || myKeys.keydown["S".charCodeAt(0)]) {
        app.main.player.move("DOWN");
    }
    if (myKeys.keydown["d".charCodeAt(0)] || myKeys.keydown["D".charCodeAt(0)]) {
        app.main.player.move("RIGHT");
    }
    if (myKeys.keydown[myKeys.KEYBOARD["KEY_SPACE"]]) {
        app.main.player.jump();
    }
    //position
    this.updateBase();
    //this.checkBounds();
}

//check the bounds of the player and act accordingly
function checkPlayerBounds() {
    if (this.position.y < this.negYBound) {
        this.position.y = this.negYBound;
        this.velocity.y = 0;
        this.rotation = 0;
        this.addForce(new Vector2(0, 0.8));
        app.main.mouse.set(500, this.negYBound + 10);
    }
    if (this.position.y > this.posYBound) {
        this.position.y = this.posYBound;
        this.rotation = 0;
        this.health -= this.velocity.magnitude() * 7;
        this.spark(this.position);
        //console.log(this.health);
        this.velocity.y = 0;
        this.addFriction(0.95);
        if (this.dead && Math.floor(Math.random() * 100 + 1) == 3) {
            this.explode("#explosionImg2", this.position.add(new Vector2(Math.random() * 30 - 15, Math.random() * 30 - 15)), new Vector2(-16, -16), 64, 4, 16);
            app.main.sound.playEffect("explosion.wav", 1.0, false);
        }
        app.main.mouse.set(500, this.posYBound - 10);
    }
    if (this.position.x < this.negXBound) {
        this.addForce(new Vector2(0.8, 0));
        app.main.mouse.set(500, 150);
    }
}

//helper function for when the player dies
function die() {
    this.explode("#explosionImg", this.position, new Vector2(-40, -40), 128, 8, 40);
    this.dead = true;
    this.sprite = document.querySelector("#brokenA10Img");
    this.velocity = new Vector2(app.main.parallax.getFrontSpeed(), 0);
    this.followMouse = false;
    this.isGravity = true;
    this.velocity = new Vector2(10, 0);
    if (!this.lockedOnSound.paused) this.lockedOnSound.pause();
    if (!this.lockedOnToSound.paused) this.lockedOnToSound.pause();
}

function move(dir) {
    switch (dir) {
        case "UP":
            this.addForce(new Vector2(0, -1));
            break;
        case "LEFT":
            this.addForce(new Vector2(-1, 0));
            break;
        case "DOWN":
            this.addForce(new Vector2(0, 1));
            break;
        case "RIGHT":
            this.addForce(new Vector2(1, 0));
            break;
        default:
            break;
    }
}

function jump() {
    this.addForce(new Vector2(0, -5));
}
//Jarrett Briody
//Project 2 sound module

"use strict";

var app = app || {};

//create a sound module
app.sound = function () {
	var bgAudio = undefined;

	//initial function is only run once as only one background song is needed
	function init() {
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume = 0.25;
	}

	//stop the background audio and reset pos
	function stopBGAudio() {
		bgAudio.pause();
		bgAudio.currentTime = 0;
	}

	//start the background audio
	function playBGAudio() {
		bgAudio.play();
	}

	//play some effect
	function playEffect(effectString) {
		var volume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.3;
		var isLoop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var immediate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

		var effectSound = document.createElement('audio');
		effectSound.volume = volume;
		effectSound.src = "sounds/" + effectString;
		effectSound.loop = isLoop;
		if (immediate) effectSound.play();
		return effectSound;
	}

	return {
		init: init,
		stopBGAudio: stopBGAudio,
		playBGAudio: playBGAudio,
		playEffect: playEffect
	};
}();
//Jarrett Briody
//Project 2 Utilities file

"use strict";

//get a vector of the mouse pos

function getMouse(e) {
    var mousePos = new Vector2(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    return mousePos;
}

//check collisions between a point and a rectangle
function aabbPointRect(x1, y1, x2, y2, width, height) {
    return x1 >= x2 && y1 >= y2 && x1 <= x2 + width && y1 <= y2 + height;
}

//check collisions between two rectangles
function aabbRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 + w1 >= x2 && y1 + h1 >= y2 && x1 <= x2 + w2 && y1 <= y2 + h2;
}

function shortestVecOutOfBox(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (aabbRectRect(x1, y1, w1, h1, x2, y2, w2, h2)) {
        console.dir("colliding");
        var v = new Vector2();
        if (x1 + w1 >= x2 && x1 <= x2) v.x += x2 - x1 + w1;else if (x1 <= x2 + w2 && x1 >= x2) v.x += x2 + w2 - x1;
        if (y1 + h1 >= y2 && y1 <= y2) v.y += y2 - y1 + h1;else if (y1 <= y2 + h2 && y1 >= y2) v.y += y2 + h2 - y1;
        return v;
    } else return null;
}
//Jarrett Briody
//Project 2 Vector library

"use strict";

//simulate a 2D vector using pixel positions

function Vector2() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;

    this.x = x;
    this.y = y;
}

Vector2.prototype.copy = copy;
Vector2.prototype.zeroOut = zeroOut;
Vector2.prototype.set = set;
Vector2.prototype.magnitude = magnitude;
Vector2.prototype.sqrMagnitude = sqrMagnitude;
Vector2.prototype.normalized = normalized;
Vector2.prototype.add = add;
Vector2.prototype.subtract = subtract;
Vector2.prototype.multiplyScalar = multiplyScalar;
Vector2.prototype.divideScalar = divideScalar;
Vector2.prototype.clampMagnitude = clampMagnitude;

//create a new vector with this vectors x and y
function copy() {
    var newCopy = new Vector2(this.x, this.y);
    return newCopy;
}

//set this vector to 0 and 0
function zeroOut() {
    this.x = 0;
    this.y = 0;
}

//set this vector to some values
function set(x, y) {
    this.x = x;
    this.y = y;
}

//calculate the magnitude of the vector
function magnitude() {
    var num = this.x * this.x + this.y * this.y;
    return Math.sqrt(num);
}

//calculate the square magnitude of the vector for slight optimization
function sqrMagnitude() {
    var num = this.x * this.x + this.y * this.y;
    return num;
}

//normalize the vector
function normalized() {
    var currentMag = this.magnitude();
    var normVector = new Vector2();
    if (currentMag != 0) {
        normVector.x = this.x / currentMag;
        normVector.y = this.y / currentMag;
        return normVector;
    }
    return normVector;
}

//add the current vector with some other vector
function add(vToAdd) {
    if (vToAdd) {
        var newVector = new Vector2();
        newVector.x = this.x + vToAdd.x;
        newVector.y = this.y + vToAdd.y;
        return newVector;
    } else return this;
}

//subtract the current vector with some other vector
function subtract(vToSubtract) {
    if (vToSubtract) {
        var newVector = new Vector2();
        newVector.x = this.x - vToSubtract.x;
        newVector.y = this.y - vToSubtract.y;
        return newVector;
    } else return this;
}

//multiply some scalar into this vector
function multiplyScalar() {
    var scalar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var newVector = this.copy();
    newVector.x *= scalar;
    newVector.y *= scalar;
    return newVector;
}

//divide some scalar into this vector
function divideScalar() {
    var scalar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var newVector = this.copy();
    newVector.x /= scalar;
    newVector.y /= scalar;
    return newVector;
}

//clamp the magnitude of this vector at some value
function clampMagnitude() {
    var maxMag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (this.sqrMagnitude() > maxMag * maxMag) {
        var normVector = this.normalized();
        this.x = normVector.x * maxMag;
        this.y = normVector.y * maxMag;
    }
}

//get the dot product of this vector and another
function dot(vToDot) {
    return this.x * vToDot.x + this.y * vToDot.y;
}
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    console.dir(action + " " + data);
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
