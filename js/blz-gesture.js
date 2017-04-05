/*
 * 手势库
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['blz'],function () {
		return fn(window.Zepto||window.jQuery,$.blz.customEvent);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.Zepto||window.jQuery);
	}else{
		fn(window.Zepto||window.jQuery);
	}
	/* jshint ignore:end */
}(function($,customEvent){
	'use strict';
	
	var constant={
		name:'blzGesture',
		petName:'blz-gesture',
		off:'blzGestureOff',
		version:'20170328',
		tap:'tap',
		longTap:'longtap',
		doubleTap:'doubletap',
		translation:'translation',
		translationX:'translationX',
		translationY:'translationY',
		translationStart:'translationstart',
		translationEnd:'translationend',
		pinch:'pinch',
		pinchStart:'pinchStart',
		pinchEnd:'pinchEnd',
		rotate:'rotate',
		rotatestart:'rotatestart',
		rotateEnd:'rotateend'
	};
	
	var config={
		timeStamp:0,
		timeStampPrev:0,
		tap:false,
		tapCount:0,
		translation:false,
		translationX:false,
		translationY:false,
		pinch:false,
		rotate:false,
		tapTime:300,
		longTapTime:750,
		dbTapTime:[],
		dbTapTimeSpace:300,
		translationStartX:0,
		translationStartY:0
	};
	
	var t=Date,
		sqrt=Math.sqrt,
		abs=Math.abs,
		atan=Math.atan;
	
	// 手势构造函数
	function Gesture(option){
		$.extend(this,config,option||{});
	}
	
	// 触摸开始
	Gesture.prototype.touchStart=function(e){
		var targetTouches=e.targetTouches,
			l1=targetTouches.length,
			data=$(this).data(constant.petName),
			finger1=targetTouches[0],
			finger2=targetTouches[1],
			dx=0,
			dy=0;
		
		data.tap=false;
		// 单手指触控
		if(l1===1){
			data.tap=true;
			data.timeStamp=data.timeStampPrev=+new t();
			if(data.translation||data.translationX||data.translationY){
				data.translationStartX=finger1.pageX;
				data.translationStartY=finger1.pageY;
				customEvent(e.target,constant.translationStart,finger1);
			}
		}else if(l1===2){
			if(data.pinch){
				dx=finger1.pageX-finger2.pageX;
				dy=finger1.pageY-finger2.pageY;
				data.diameter=sqrt(dx*dx+dy*dy);
				data.angle=atan(dy/dx)*57.3;
				customEvent(e.target,constant.pinchStart);
			}
			//if(data.rotate){
//				dx=finger1.pageX-finger2.pageX;
//				dy=finger1.pageY-finger2.pageY;
//				data.angle=atan(dy/dx)*57.3;
//				customEvent(e.target,constant.rotatestart);
//			}
		}
	};
	
	// 触摸中
	Gesture.prototype.touchMove=function(e){
		var targetTouches=e.targetTouches,
			l1=targetTouches.length,
			data=$(this).data(constant.petName),
			finger1=targetTouches[0],
			finger2=targetTouches[1],
			dx=0,
			dy=0,
			scale=1;
		
		data.tap=false;
		
		// 单手指触控
		if(l1===1){
			if(data.translation){
				e.preventDefault();
				customEvent(e.target,constant.translation,finger1);
			}else if(data.translationX){
				dx=finger1.pageX-data.translationStartX;
				dy=finger1.pageY-data.translationStartY;
				if(abs(dx/dy)>1.2){
					e.preventDefault();
					customEvent(e.target,constant.translationX,finger1);
				}
			}else if(data.translationY){
				dx=finger1.pageX-data.translationStartX;
				dy=finger1.pageY-data.translationStartY;
				if(abs(dx/dy)<0.8){
					e.preventDefault();
					customEvent(e.target,constant.translationY,finger1);
				}
			}
				
		}else if(l1===2){
			e.preventDefault();
			// 双手指触控
			if(data.pinch){
				dx=finger1.pageX-finger2.pageX;
				dy=finger1.pageY-finger2.pageY;
				scale=sqrt(dx*dx+dy*dy)/data.diameter;
				customEvent(e.target,constant.pinch,[scale,atan(dy/dx)*57.3-data.angle]);
			}
			//if(data.rotate){
//				dx=finger1.pageX-finger2.pageX;
//				dy=finger1.pageY-finger2.pageY;
//				customEvent(e.target,constant.rotate,atan(dy/dx)*57.3-data.angle);
//			}
		}
	};
	
	//触摸结束
	Gesture.prototype.touchEnd=function(e){
		var data=$(this).data(constant.petName),
			time=+new t(),
			target=e.target,
			dt=time-data.timeStamp,
			l1=e.targetTouches.length;
		
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
		
		// translationEnd
		if(l1===0&&(data.translation||data.translationX||data.translationY)){
			customEvent(e.target,constant.translationEnd,e.changedTouches[0]);
		}
		
		// rotateEnd pinchEnd
		if(l1===1){
			if(data.pinch){
				customEvent(e.target,constant.pinchEnd,e.changedTouches[0]);	
			}
			//if(data.rotate){
//				customEvent(e.target,constant.rotateEnd);	
//			}	
		}
		
		// 初始化
		data.tap=false;
	};
	
	// 开启手势
	$.fn[constant.name]=function(option){
		return this.data(constant.petName,new Gesture(option))
			[constant.off]()
			.on('touchstart.'+constant.name,Gesture.prototype.touchStart)
			.on('touchend.'+constant.name,Gesture.prototype.touchEnd)
			.on('touchmove.'+constant.name,Gesture.prototype.touchMove);
		//.on('touchcancel.'+constant.name,Gesture.prototype.touchCancel)
	};
	
	// 关闭手势
	$.fn[constant.off]=function(){
		return this.off('touchstart.'+constant.name+' touchend.'+constant.name+' touchmove.'+constant.name);	
	};
	
	return $;
}));