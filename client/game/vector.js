//Jarrett Briody
//Project 2 Vector library

"use strict";

//simulate a 2D vector using pixel positions
function Vector2(x = 0.0, y = 0.0){
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
function copy(){
    var newCopy = new Vector2(this.x,this.y);
    return newCopy;
}

//set this vector to 0 and 0
function zeroOut(){
    this.x = 0;
    this.y = 0;
}

//set this vector to some values
function set(x,y){
    this.x = x;
    this.y = y;
}

//calculate the magnitude of the vector
function magnitude(){
    var num = (this.x * this.x) + (this.y * this.y);
    return Math.sqrt(num);
}

//calculate the square magnitude of the vector for slight optimization
function sqrMagnitude(){
    var num = (this.x * this.x) + (this.y * this.y);
    return num;
}

//normalize the vector
function normalized(){
    var currentMag = this.magnitude();
    var normVector = new Vector2();
    if(currentMag != 0){
        normVector.x = this.x / currentMag;
        normVector.y = this.y / currentMag;
        return normVector;
    }
    return normVector;
}

//add the current vector with some other vector
function add(vToAdd){
    if(vToAdd){
        var newVector = new Vector2();
        newVector.x = this.x + vToAdd.x;
        newVector.y = this.y + vToAdd.y;
        return newVector;
    }
    else return this;
}

//subtract the current vector with some other vector
function subtract(vToSubtract){
    if(vToSubtract){
        var newVector = new Vector2();
        newVector.x = this.x - vToSubtract.x;
        newVector.y = this.y - vToSubtract.y;
        return newVector;
    }
    else return this;
}

//multiply some scalar into this vector
function multiplyScalar(scalar = 1){
    var newVector = this.copy();
    newVector.x *= scalar;
    newVector.y *= scalar;
    return newVector;
}

//divide some scalar into this vector
function divideScalar(scalar = 1){
    var newVector = this.copy();
    newVector.x /= scalar;
    newVector.y /= scalar;
    return newVector;
}

//clamp the magnitude of this vector at some value
function clampMagnitude(maxMag = 1){
    if(this.sqrMagnitude() > maxMag * maxMag){
        var normVector = this.normalized();
        this.x = normVector.x * maxMag;
        this.y = normVector.y * maxMag;
    }
}

//get the dot product of this vector and another
function dot(vToDot){
    return this.x * vToDot.x + this.y * vToDot.y;
}

