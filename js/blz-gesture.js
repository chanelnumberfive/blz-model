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
		version:'20170328',
		tap:'tap'
	};
	
	var config={
		onTap:'',
		onDoubleTap:'',
		onLongTap:'',
		onPan:'',
		onSwipe:'',
		onRotate:'',
		onPinch:'',
		onHould:'',
		touches:[],
		timeStamp:0,
		timeStampPrev:0,
		triggerTap:false,
		triggerLongTap:false
	};
	
	// 手势构造函数
	function Gesture(option){
		$.extend(this,config,option||{});
	}
	
	// 触摸开始
	Gesture.prototype.touchStart=function(e){
		var touches=e.touches,
			l=touches.length,
			data=$(this).data(constant.petName);
		
		// 单手指触控
		if(l===1){
			data.triggerTap=data.triggerLongTap=true;
			data.timeStamp=data.timeStampPrev=+new Date();
		}else if(l===2){
			
			// 取消单手指产生的事件
			data.triggerTap=data.triggerLongTap=false;
			
			// 双手指触控
			
		}else{
			
			// 多手指触控
			
		}
	};
	
	// 触摸中
	Gesture.prototype.touchMove=function(e,data){
		var touches=e.touches,
			l=touches.length,
			data=$(this).data(constant.petName);
		
		data.triggerTap=data.triggerLongTap=false;
		// 单手指触控
		if(l===1){
			
		}else if(l===2){
			// 双手指触控
			
		}else{
			
			// 多手指触控
			
		}
	};
	
	//触摸结束
	Gesture.prototype.touchEnd=function(e){
		var data=$(this).data(constant.petName);
		if(data.triggerTap){
			setTimeout(function(){
				$(e.target).trigger(constant.tap);
			},0);
		}
	};
	
	Gesture.prototype.touchCancel=function(e){
		
	};
	
	// 开启手势
	$.fn[constant.name]=function(option){
		return this.data(constant.petName,new Gesture())
			.off('touchstart.'+constant.name+' touchend.'+constant.name)
			.on('touchstart.'+constant.name,Gesture.prototype.touchStart)
			.on('touchend.'+constant.name,Gesture.prototype.touchEnd)
			.on('touchcancel.'+constant.name,Gesture.prototype.touchCancel);
	};
	return $;
}));