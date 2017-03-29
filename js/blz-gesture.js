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
		timeStamp:[]
	};
	
	// 手势构造函数
	function Gesture(option){
		$.extend(this,config,option||{});
	}
	
	// 触摸开始
	Gesture.prototype.touchStart=function(e){
		var $this=$(this),
			data=$this.data(constant.petName),
			event=e.touches[0];
		data.x1=data.x11=event.pageX;
		data.y1=data.y11=event.pageY;
		$this.off('touchmove.'+constant.name).on('touchmove.'+constant.name,function(e){
			Gesture.prototype.touchMove(e,data);
		});
		this.textContent=e.touches.length;
	};
	
	// 触摸中
	Gesture.prototype.touchMove=function(e,data){
		var touches=e.touches,
			event=touches[0];
		if(touches.length<2){
			data.x11=event.pageX;
			data.y11=event.pageY;
		}
	};
	
	//触摸结束
	Gesture.prototype.touchEnd=function(e,data){
		var $this=$(this),
			data=$this.data(constant.petName),
			event=e.touches[0];
		console.log(e);
		$this.off('touchmove.'+constant.name);
		this.textContent=e.touches.length;
	};
	
	// 开启手势
	$.fn[constant.name]=function(option){
		this.data(constant.petName,new Gesture())
			.off('touchstart.'+constant.name+' touchend.'+constant.name)
			.on('touchstart.'+constant.name,Gesture.prototype.touchStart)
			.on('touchend.'+constant.name,Gesture.prototype.touchEnd);
	};
	
	return $;
}));