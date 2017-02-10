;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['blz'],function () {
		return fn(window.jQuery);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(window.jQuery);
	}
	/* jshint ignore:end */
})(function($){
	'use strict';

	var hack=$.blz.checkTransition(),
		h=window.innerHeight,
		w=window.innerWidth;
	
	// 移动构造函数
	function Move(elem){
		this.x=0;
		this.y=0;
		this.shiftX=0;
		this.shiftY=0;
		this.dx=0;
		this.dy=0;
		this.prevDx=0;
		this.prevDy=0;
		this.elem=elem;
		this.clientRect=elem.getBoundingClientRect();
		this.minShiftX=-this.clientRect.left;
		this.maxShiftX=w-this.clientRect.right;
		this.minShiftY=-this.clientRect.top;
		this.maxShiftY=h-this.clientRect.bottom;
	}
	
	// 移动开始
	Move.prototype.touchStart=function(e){
		var event=e.touches[0],
			$this=$(data.elem),
			data=$this.data('blz-move');
		data.x=event.pageX;
		data.y=event.pageY;
		$this.on('touchmove.blzmove',Move.prototype.touchMove);
	};
	
	// 移动中
	Move.prototype.touchMove=function(e){
		e.preventDefault();
		var event=e.touches[0],
			$this=$(data.elem),
			data=$this.data('blz-move');
		data.dx=event.pageX-data.x;
		data.dy=event.pageY-data.y;
		data.shiftX=data.dx+data.prevDx<data.minShiftX?data.minShiftX:(data.dx+data.prevDx>data.maxShiftX?data.maxShiftX:data.dx+data.prevDx);
		data.shiftY=data.dy+data.prevDy<data.minShiftY?data.minShiftY:(data.dy+data.prevDy>data.maxShiftY?data.maxShiftY:data.dy+data.prevDy);
		$this.css(hack+'transform','translate('+data.shiftX+'px,'+data.shiftY+'px)');
	};
	
	// 移动结束
	Move.prototype.touchEnd=function(){
		var $this=$(data.elem),
			data=$this.data('blz-move');
		data.prevDx=data.shiftX;
		data.prevDy=data.shiftY;
		data.dx=data.dy=data.x=data.y=0;
		$this.off('touchmove.blzmove');
	};
	
	// 开启移动
	$.fn.blzMove=function(){
		this.data('blz-move',new Move(this[0]));
		this.on('touchstart.blzmove',Move.prototype.touchStart);
		this.on('touchend.blzmove',Move.prototype.touchEnd);
	};
	
	// 关闭移动
	$.fn.blzOffMove=function(){
		this.removeData('blz-move');
		this.off('touchstart.blzmove touchend.blzmove');	
	};
});