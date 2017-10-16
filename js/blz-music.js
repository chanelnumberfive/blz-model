/*
 * blz模块声明
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define([],function () {
		return fn();
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn();
	}else{
		fn();
	}
	/* jshint ignore:end */
}(function(){
	'use strict';
	
	var audioCtx=(function(){
		if(window.AudioContext){
			return new window.AudioContext();
		}else{
			return new window.webkitAudioContext();
		}
	})();
	
	// music constructure
	function Music(){
		definePropertySrc(this);
		definePropertyVolume(this);
		definePropertyLoop(this);
		definePropertyRate(this);
		definePropertyDuration(this);
	}
	// set the Music constructure's musicContext property's value
	Music.musicContext=audioCtx;
	
	// define property src
	function definePropertySrc(context){
		Object.defineProperty(context,'src',{
			get:function(){
				return this._src||'';
			},
			set:function(src){
				var that=this;
				this._src=src;
				var xhr=new XMLHttpRequest();
				xhr.open('GET',src,true);
				xhr.responseType='arraybuffer';
				xhr.onload=function(){
					Music.musicContext.decodeAudioData(this.response,function(buffer){
						that.buffer=buffer;
						if(that.onload instanceof Function){
							that.onload();
						}
					},function(e){
						console.log(e);
					});
				};
				xhr.send(null);
			}
		});
	}
	
	function definePropertyVolume(context){
		Object.defineProperty(context,'volume',{
			get:function(){
				return this._volume||1;
			},
			set:function(volume){
				this._volume=volume;
				this.gainNode.gain.value=volume;
			}
		});
	}
	
	function definePropertyLoop(context){
		Object.defineProperty(context,'loop',{
			get:function(){
				return this._loop||false;
			},
			set:function(boolean){
				this._loop=boolean;
				this.source.loop=boolean;	
			}
		});
	}
	
	function definePropertyRate(context){
		Object.defineProperty(context,'rate',{
			get:function(){
				return this._rate||1;
			},
			set:function(rate){
				this._rate=rate;
				this.source.playbackRate.value=rate;	
			}
		});
	}
	
	function definePropertyDuration(context){
		Object.defineProperty(context,'duration',{
			get:function(){
				return this.source.buffer.duration;
			}
		});
	}
	
	Music.prototype.start=function(){
		this.currentTime=audioCtx.currentTime;
		return this.startAt(this.currentTime||0);
	};
	
	Music.prototype.stop=function(){
		if(this.blzStart){
			this.source.stop();
			this.blzStart=false;
		}
		return this;
	};
	
	Music.prototype.replay=function(){
		return this.startAt(0);
	};
	
	Music.prototype.startAt=function(time){
		if(this.blzStart){
			this.stop();
		}
		
		this.source=audioCtx.createBufferSource();
		
		// loop
		this.source.loop=true;
		
		this.source.buffer=this.buffer;
		this.gainNode=audioCtx.createGain();
		this.source.connect(this.gainNode);
		this.gainNode.connect(audioCtx.destination);
		
		// Fade it in.
		this.gainNode.gain.linearRampToValueAtTime(0, time);
		this.gainNode.gain.linearRampToValueAtTime(this.volume, time+1);
		
		var duration=this.source.buffer.duration;
		
		// Then fade it out.
		//this.gainNode.gain.linearRampToValueAtTime(this.volume, time+duration-3);
		//this.gainNode.gain.linearRampToValueAtTime(0, time+duration);
		
		// voice
		this.gainNode.gain.value=this.volume||1;
		
		// speed
		this.source.playbackRate.value=this.rate||1;
		
		this.source.start(0,time%duration);
		this.blzStart=true;
		console.log(this.source);
		return this;
	};
	
	window.Music=Music;
}));