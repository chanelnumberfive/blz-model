/*
 * 手势库
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['zepto'],function () {
		return fn(window.Zepto);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.Zepto);
	}else{
		fn(window.Zepto);
	}
	/* jshint ignore:end */
}(function($){
	'use strict';
	
	var constant={
		name:'blzGesture',
		petName:'blz-gesture',
		off:'blzGestureOff',
		version:'20170328',
		tap:'tap',
		longTap:'longTap',
		doubleTap:'doubleTap',
		translation:'translation',
		pinch:'pinch',
		rotate:'rotate'
	};
	
	var config={
		timeStamp:0,
		timeStampPrev:0,
		tap:false,
		tapCount:0,
		translation:false,
		pinch:false,
		rotate:false,
		tapTime:300,
		longTapTime:750,
		dbTapTime:[],
		dbTapTimeSpace:300
	};
	
	var d=document,
		t=Date,
		abs=Math.abs,
		sqrt=Math.sqrt,
		atan=Math.atan;
	
	// 自定义事件
	function customEvent(elem,name,data){
		var event = d.createEvent('CustomEvent');
		event.initCustomEvent(name,true,false,data);
		elem.dispatchEvent(event);
	}
	
	// 手势构造函数
	function Gesture(option){
		$.extend(this,config,option||{});
	}
	
	// 触摸开始
	Gesture.prototype.touchStart=function(e){
		var touches=e.touches,
			targetTouches=e.targetTouches,
			l=touches.length,
			l1=targetTouches.length,
			data=$(this).data(constant.petName),
			finger1=touches[0],
			finger2=touches[1],
			dx=0,
			dy=0;
		
		data.tap=false;
		// 单手指触控
		if(l===1&&l1===1){
			data.tap=true;
			data.timeStamp=data.timeStampPrev=+new t();
		}else if(l===2&&l1===2){
			if(data.pinch){
				dx=finger1.pageX-finger2.pageX;
				dy=finger1.pageY-finger2.pageY;
				data.diameter=sqrt(dx*dx+dy*dy);
			}
			if(data.rotate){
				dx=finger1.pageX-finger2.pageX;
				dy=finger1.pageY-finger2.pageY;
				data.angle=atan(dy/dx)*57.3;
			}
		}
	};
	
	// 触摸中
	Gesture.prototype.touchMove=function(e){
		var touches=e.touches,
			targetTouches=e.targetTouches,
			l=touches.length,
			l1=targetTouches.length,
			data=$(this).data(constant.petName),
			finger1=touches[0],
			finger2=touches[1],
			dx=0,
			dy=0,
			scale=1;
		
		data.tap=false;
		
		// 单手指触控
		if(l===1&&l1===1&&data.translation){
			e.preventDefault();
			customEvent(e.target,constant.translation,finger1);	
		}else if(l===2&&l1===2){
			e.preventDefault();
			// 双手指触控
			if(data.pinch){
				dx=finger1.pageX-finger2.pageX;
				dy=finger1.pageY-finger2.pageY;
				scale=sqrt(dx*dx+dy*dy)/data.diameter;
				customEvent(e.target,constant.pinch,scale);
			}
			if(data.rotate){
				dx=finger1.pageX-finger2.pageX;
				dy=finger1.pageY-finger2.pageY;
				customEvent(e.target,constant.rotate,atan(dy/dx)*57.3-data.angle);
			}
		}
	};
	
	//触摸结束
	Gesture.prototype.touchEnd=function(e){
		var data=$(this).data(constant.petName),
			time=+new t(),
			target=e.target,
			dt=time-data.timeStamp;
		
		if(data.tap){
			if(dt<data.tapTime){
				// tap
				setTimeout(function(){
					customEvent(target,constant.tap);
				},0);
				
				// doubleTap
				data.dbTapTime[data.tapCount]=time;
				data.tapCount++;
				if(data.tapCount===2&&data.dbTapTime[1]-data.dbTapTime[0]<data.dbTapTimeSpace){
					setTimeout(function(){
						customEvent(target,constant.doubleTap);
					},0);
					data.dbTapTime=[];
					data.tapCount=0;
				}else{
					data.dbTapTime.shift();
					data.tapCount=1;
				}
			}else if(dt>data.longTapTime){
				
				// longTap
				setTimeout(function(){
					customEvent(target,constant.longTap);
				},0);
			}
		}
		
		// 初始化
		data.tap=false;
	};
	
	// 开启手势
	$.fn[constant.name]=function(option){
		return this.data(constant.petName,new Gesture(option))
			.off('touchstart.'+constant.name+' touchend.'+constant.name)
			.on('touchstart.'+constant.name,Gesture.prototype.touchStart)
			.on('touchend.'+constant.name,Gesture.prototype.touchEnd)
			.on('touchmove.'+constant.name,Gesture.prototype.touchMove)
			.on('touchcancel.'+constant.name,Gesture.prototype.touchCancel);
	};
	
	// 关闭手势
	$.fn[constant.off]=function(){
		return this.off('touchstart.'+constant.name+' touchend.'+constant.name+' touchmove.'+constant.name+' touchcancel.'+constant.name);	
	};
	
	return $;
}));