"use strict";

var app = app || {};

app.main = {
    canvas: undefined,
    ctx: undefined,
    player: undefined,
    background:undefined,
    blocks:[],
    blocksPos:[
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ],
    mouse: undefined,
    frameCount:0,
    width: 1280,
    height: 720,
    lastTime: undefined,
    dt: 0,
    baseBlockScale:0.62,
    blockScale:undefined,

    //call initial function, only run once
    init: function(){
        this.canvas = document.querySelector("#baseCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.canvas.style.cursor = "crosshair";
        this.mouse = new Vector2(500,150);
        this.canvas.oncontextmenu = function(){ return false; }
        this.canvas.onmousemove = this.checkMousePos.bind(this); //get new mouse pos
        this.canvas.onmousedown = this.checkMouseButtonClicks.bind(this); //check what mouse button was pressed
        //this.canvas.onmouseup = (function(){ if(!this.isReady) this.isReady = true; }).bind(this);
        this.lastTime = Date.now();
        this.background = new GameObject("#backgroundImg");
        this.player = new Player("#playerImg");
        this.blockScale = document.querySelector("#blockImg").width * this.baseBlockScale;
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 20; j++){
                if(this.blocksPos[i*20+j] === 1){
                    let block = new GameObject("#blockImg");
                    block.scale.x = this.baseBlockScale;
                    block.scale.y = this.baseBlockScale;
                    block.position.x = (j) * this.blockScale;
                    block.position.y = (i) * this.blockScale;
                    this.blocks.push(block);
                }
            }
        }
        this.update();
    },

    //update method called 60 times per second, or as close as possible
    update: function(){
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.dt = Date.now() - this.lastTime;
        this.lastTime = Date.now();
        this.background.updateBase();
        this.player.update();
        for(let i = 0; i < this.blocks.length; i++){
            this.blocks[i].updateBase();
            let v = shortestVecOutOfBox(this.player.position.x,this.player.position.y,this.player.sprite.width,this.player.sprite.height,this.blocks[i].position.x,this.blocks[i].position.y,this.blocks[i].sprite.width * this.blockScale,this.blocks[i].sprite.height * this.blockScale);
            if(v != null){
                console.dir(v);
                this.player.position.add(v);
            }
        }
        this.draw();
        this.frameCount++;
    },

    checkMouseButtonClicks: function(e) {
        switch(e.button){
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
    checkMousePos: function(e){
        this.mouse = getMouse(e);
    },

    draw:function(){
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.background.draw(this.ctx);
        for(let i = 0; i < this.blocks.length; i++){
            this.blocks[i].draw(this.ctx);
        }
        this.player.draw(this.ctx);
    }
};