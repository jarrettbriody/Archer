//Jarrett Briody
//Project 2 Classes file

"use strict";

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   Generic Particle                   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Particle(spriteID, pos = null, vel = null, angVel = 0, scale = null, time = -1, fade = false, isGravity = false){
    GameObject.call(this,spriteID);
    this.timeOut = time;
    this.timeOutStartTime = Date.now();
    this.isFading = fade;
    this.angularVelocity = angVel;
    this.position = pos;
    this.position = this.position.add(new Vector2(-this.sprite.width / 2,this.sprite.height / 2));
    this.maxSpd = 20;
    this.velocity = vel;
    this.isGravity = isGravity;
    this.scale = scale;
}

Particle.prototype = Object.assign({},GameObject.prototype);
Particle.prototype.update = updateParticle;
Particle.prototype.smoke = smoke;

//simple override of updateBase
function updateParticle(){
    this.updateBase();
    if(this.spriteID == "#scarImg" && this.position.x < -20){
        this.dead = true;
    }
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   Bullet                   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Bullet(spriteID){
    GameObject.call(this,spriteID);
    //this.collided = false;
    this.maxSpd = 1000;
    this.tracerScale = 1;
}

Bullet.prototype = Object.assign({},GameObject.prototype);
Bullet.prototype.update = updateProjectile;


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   Universal Functions                   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//updateBase override for a tank or tunguska
function updateGroundVehicle(){
    this.updateBase();
    this.inBounds = this.checkBounds();
    if(this.inBounds && this.frameCount % 1 == 0){
        var newSmoke = new Particle(
            "#smokeImg",
            this.position.add(new Vector2((Math.random() * this.sprite.width * 3/4), (this.sprite.height / 2 + (Math.random() * 3 - 1.5)) - 10)),
            new Vector2(app.main.parallax.getFrontSpeed(), Math.random() * -0.5),
            Math.random() * 0.2,
            new Vector2(0.5,0.5),
            500,
            true,
            false
        );
        app.main.particles.push(newSmoke);
    } 
    if(this.inBounds && this.fires && !this.dead){
        if(this.missileTimeOut > 0.0){
            if(this.missileTimeOut <= Date.now() - this.missileTimeOutStartTime){
                this.missileTimeOut = 0.0;
            }
        }
        else{
            this.fire();
        }
    }
    if(this.vSound && this.inBounds){
        var newVol = (1-(app.main.player.position.subtract(this.position).magnitude() / (app.main.width - 100))) * 0.5;
        if(newVol > 1) newVol = 1;
        else if(newVol < 0) newVol = 0;
        this.vSound.volume = newVol;
        if(this.vSound.currentTime >= this.vSound.duration - 0.1){
            this.vSound.currentTime = 0;
        }
    }
    if(this.inBounds && this.vSound.paused){
        this.vSound.play();
    }
    if(this.dead && !this.vSound.paused){
        this.vSound.pause();
    }
}

//check to see if the enemy has passed the player, if so then kill it
function checkEnemyBounds(){
    if(this.position.x < this.negXBound){
        this.dead = true;
        return false;
    }
    return this.position.x < this.posXBound;
}

//explode helper function
function explode(spriteID, pos, offset,frameWidth,rowCount,endIndex){
    var newExplosion = new Explosion(spriteID, pos, offset,frameWidth,rowCount,endIndex);
    app.main.explosions.push(newExplosion);
}

//spark helper function
function spark(pos){
    var numOfSparks = Math.floor(Math.random() * 2) + 1;
    for(var i = 0; i < numOfSparks; i++){
        var pos1 = pos;
        var pos2 = pos1.add((new Vector2((Math.random() * 2 - 1), (Math.random() * 2 - 1)).multiplyScalar(Math.random()*5 + 10)));
        app.main.sparks.push({
            start: pos1,
            end: pos2,
            alpha:0.5,
            color: app.main.sparkColors[Math.floor(Math.random()*5)]
        });
    }
}

//smoke helper function
function smoke(pos, vel, rot, scale){
    var newSmoke = new Particle(
        "#smoke2Img",
        pos,
        vel,
        rot,
        new Vector2(1,1).multiplyScalar(scale),
        1000,
        true,
        false
    );
    app.main.particles.push(newSmoke);
}

//updateBase override for projectiles like missiles and bullets
function updateProjectile(){
    this.updateBase();
    if(this.inBounds){
        var posYBound = 670;
        if(this.position.y > posYBound){
            this.dead = true;
            var scaleVec = Math.random() * 0.5 + 0.5;
            var newSmoke = new Particle(
                "#smokeImg",
                this.position.copy(),
                new Vector2(app.main.parallax.getFrontSpeed(), -0.2),
                0.05,
                new Vector2(scaleVec,scaleVec),
                1000,
                true,
                false
            );
            app.main.particles.push(newSmoke);
            
            scaleVec = Math.random() * 1 + 0.5;
            var rand = Math.floor(Math.random() * 6);
            for(var i = 0; i < rand; i++){
                var newRock = new Particle(
                    "#rockImg",
                    this.position.copy(),
                    new Vector2(Math.floor((Math.random() * -11)), Math.random() * -3),
                    Math.random() * 0.2 - 0.1,
                    new Vector2(scaleVec,scaleVec),
                    500,
                    true,
                    true
                );
                app.main.particles.push(newRock);
            }
    
            var newScar = new Particle(
                "#scarImg",
                this.position.subtract(new Vector2(4,0)),
                new Vector2(app.main.parallax.getFrontSpeed(), 0),
                0,
                new Vector2(1,1),
                -1,
                true,
                false
            );
            app.main.roadScars.push(newScar);
        }
    }
    else this.dead = true;
}
