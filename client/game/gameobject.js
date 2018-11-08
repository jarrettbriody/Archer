//Jarrett Briody
//Project 2 gameobject file

"use strict";

//gameobject parent class for every gameobject
function GameObject(spriteID = "#NULL"){
    this.health = 100;
    this.position = new Vector2();
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
    this.scale = new Vector2(1,1);
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
    if(this.sprite){
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
function updateBase(){
    if(this.isGravity) this.addForce(this.gravityForce);
    this.calcPos();
    if(this.sprite) this.checkBoundsBase();
    if(this.angularVelocity != 0) this.updateRot();
    if(this.timeOut != -1) this.handleTimeOut();
    if(this.timeOut != -1 && this.isFading) this.handleFade();
    this.frameCount++;
}

//add force for this update
function addForce(forceVector){
    this.acceleration = this.acceleration.add(forceVector);
}

//add friction for this update
function addFriction(coefficient = 0.95){
    var velMag = this.velocity.magnitude();
    var normVelocity = this.velocity.normalized();
    var scaledForce = normVelocity.multiplyScalar(-1 * velMag * (1 - coefficient));
    this.addForce(scaledForce);
}

//return a seek force using a seeking algorithm
function seek(targetPos,w = 0.5){
    var desiredVelocity = targetPos.subtract(this.position);
    desiredVelocity = desiredVelocity.normalized();
    desiredVelocity = desiredVelocity.multiplyScalar(this.maxSpd);
    var steeringForce = desiredVelocity.subtract(this.velocity);
    return steeringForce.multiplyScalar(w);
}

//return a seek force purely in x direction
function seekX(targetPos,w = 0.5){
    var desiredVelocity = new Vector2(targetPos.x - this.position.x,0);
    desiredVelocity.x *= app.main.dt * w / 1000;
    return desiredVelocity;
}

//return a seek force purely in y direction
function seekY(targetPos,w = 0.5){
    var desiredVelocity = new Vector2(0,targetPos.y - this.position.y);
    desiredVelocity.y *= app.main.dt * w / 1000;
    return desiredVelocity;
}

//calculate the new position for this update
function calcPos(){
    this.acceleration.clampMagnitude(this.maxAccel);
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity.clampMagnitude(this.maxSpd);
    var tempMagnitude = this.velocity.magnitude();
    if(tempMagnitude < 0.01) this.velocity.zeroOut();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //this.checkBounds();
    this.acceleration.zeroOut();
}

//base check bounds method for all game objects
function checkBoundsBase(){
    if(this.position.x > this.negXBound && this.position.x < this.posXBound && this.position.y > this.negYBound && this.position.y < this.posYBound){
        this.inBounds = true;
    }
    else this.inBounds = false;
}

//the this gameobject has a timeout, update it
function handleTimeOut(){
    if(this.timeOut <= Date.now() - this.timeOutStartTime){
        this.timeOut = -1;
        this.dead = true;
    } 
}

//if this gameobject is fading, update it
function handleFade(){
    this.alpha = 1 - ((Date.now() - this.timeOutStartTime) / this.timeOut);
}

//if this gameobject has an angular velocity, rotate it
function updateRot(){
    this.rotation += this.angularVelocity;
}

//if this gameobject is a jet, give it a trail
function updateTrail(trailList,offset,reverseDir){
    if(this.frameCount % 1 == 0 && this.inBounds){
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
        if(reverseDir) newVertex.velocity = new Vector2(this.velocity.x + 5,0);
        else newVertex.velocity = new Vector2(this.velocity.x - 10,0);//new Vector2(app.main.parallax.getFrontSpeed() + this.velocity.x,0);

        newVertex.velocity.y = 0;
        trailList.push(newVertex);
    } 
}

//draw the trail if the object is a jet
function drawTrail(trailList, ctx){
    if(trailList.length > 0){
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        trailList[trailList.length - 1].updateBase();
        ctx.beginPath();
        ctx.moveTo(trailList[trailList.length - 1].position.x,trailList[trailList.length - 1].position.y);
        for(var i = trailList.length - 1; i >= 1; i--){
            trailList[i-1].updateBase();
            if(trailList[i-1].dead){
                trailList.splice(i-1,1);
            } 
            else{
                ctx.lineTo(trailList[i-1].position.x,trailList[i-1].position.y);
            } 
        }
        ctx.stroke();
        ctx.restore();
    }
}

//draw the gameobject itself
function draw(ctx){
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.position.x + this.sprite.width / 2, this.position.y + this.sprite.height / 2);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale.x,this.scale.y);
    ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);
    ctx.restore();
}
