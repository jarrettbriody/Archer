//Jarrett Briody
//Project 2 sound module

"use strict";
var app = app || {};

//create a sound module
app.sound = (function(){
	var bgAudio = undefined;

    //initial function is only run once as only one background song is needed
	function init(){
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume=0.25;
	}
        
    //stop the background audio and reset pos
	function stopBGAudio(){
		bgAudio.pause();
		bgAudio.currentTime = 0;
	}

    //start the background audio
	function playBGAudio(){
		bgAudio.play();
    }
    
    //play some effect
	function playEffect(effectString, volume = 0.3, isLoop = false, immediate = true){
        var effectSound = document.createElement('audio');
        effectSound.volume = volume;
        effectSound.src = "sounds/" + effectString;
        effectSound.loop = isLoop;
        if(immediate) effectSound.play();
        return effectSound;
	}

	return{
		init:init,
		stopBGAudio:stopBGAudio,
		playBGAudio:playBGAudio,
		playEffect:playEffect
	};
}());