//Jarrett Briody
//Project 2 Utilities file

"use strict";

//get a vector of the mouse pos
function getMouse(e){
    var mousePos = new Vector2(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    return mousePos;
}

//check collisions between a point and a rectangle
function aabbPointRect(x1,y1,x2,y2,width,height){
    return x1 >= x2 && y1 >= y2 && x1 <= x2 + width && y1 <= y2 + height;
}

//check collisions between two rectangles
function aabbRectRect(x1,y1,w1,h1,x2,y2,w2,h2){
    return x1 + w1 >= x2 && y1 + h1 >= y2 && x1 <= x2 + w2 && y1 <= y2 + h2;
}

function shortestVecOutOfBox(x1,y1,w1,h1,x2,y2,w2,h2){
    if(aabbRectRect(x1,y1,w1,h1,x2,y2,w2,h2)){
        console.dir("colliding");
        let v = new Vector2();
        if(x1+w1 >= x2 && x1 <= x2) v.x += x2-x1+w1;
        else if(x1 <= x2 + w2 && x1 >= x2) v.x += x2+w2-x1;
        if(y1+h1 >= y2 && y1 <= y2) v.y += y2-y1+h1;
        else if(y1 <= y2 + h2 && y1 >= y2) v.y += y2+h2-y1;
        return v;
    }
    else return null;
}