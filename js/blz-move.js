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
	
	var constent={
		name:'blzMove',
		petName:'blz-move',
		version:'20170321'
	};
	var hack=$.blz.checkTransition(),
		h=window.innerHeight,
		w=window.innerWidth,
		config={
			translateX:0,
			translateY:0,
			toSide:true,
			transition:'transform 300ms linear'
		};
	// 移动构造函数
	function Move(elem,option){
		this.toSideX=(w-elem.offsetWidth)/2;
		this.x=0;
		this.y=0;
		this.shiftX=0;
		this.shiftY=0;
		this.dx=0;
		this.dy=0;
		this.prevDx=option.translateX;
		this.prevDy=option.translateY;
		this.elem=elem;
		this.clientRect=elem.getBoundingClientRect();
		this.minShiftX=-this.clientRect.left+this.prevDx;
		this.maxShiftX=w-this.clientRect.right+this.prevDx;
		this.minShiftY=-this.clientRect.top+this.prevDy;
		this.maxShiftY=h-this.clientRect.bottom+this.prevDy;
		$.extend(this,config,option||{});
	}
	
	// 移动开始
	Move.prototype.touchStart=function(e){
		var event=e.touches[0],
			$this=$(this),
			data=$this.data(constent.petName);
		data.x=event.pageX;
		data.y=event.pageY;
		$this.on('touchmove.'+constent.name,Move.prototype.touchMove);
	};
	
	// 移动中
	Move.prototype.touchMove=function(e){
		e.preventDefault();
		var event=e.touches[0],
			$this=$(this),
			data=$this.data(constent.petName);
		data.dx=event.pageX-data.x;
		data.dy=event.pageY-data.y;
		data.shiftX=data.dx+data.prevDx<data.minShiftX?data.minShiftX:(data.dx+data.prevDx>data.maxShiftX?data.maxShiftX:data.dx+data.prevDx);
		data.shiftY=data.dy+data.prevDy<data.minShiftY?data.minShiftY:(data.dy+data.prevDy>data.maxShiftY?data.maxShiftY:data.dy+data.prevDy);
		$this.css(hack+'transform','translate('+data.shiftX+'px,'+data.shiftY+'px)');
	};
	
	// 移动结束
	Move.prototype.touchEnd=function(e){
		var $this=$(this),
			data=$this.data(constent.petName);
		data.prevDx=data.shiftX;
		data.prevDy=data.shiftY;
		data.dx=data.dy=data.x=data.y=0;
		$this.off('touchmove.'+constent.name);
		if(data.toSide){
			data.toSideFn($this,data);	
		}
	};
	
	// 贴边
	Move.prototype.toSideFn=function($elem,data){
		var cssData={};
		cssData[hack+'transition']=data.transition;
		if($elem[0].getBoundingClientRect().left<data.toSideX){
			cssData[hack+'transform']='translate('+data.minShiftX+'px,'+data.shiftY+'px)';
			data.prevDx=data.shiftX=data.minShiftX;
			$elem.css(cssData);
		}else{
			cssData[hack+'transform']='translate('+data.maxShiftX+'px,'+data.shiftY+'px)';
			data.prevDx=data.shiftX=data.maxShiftX;
			$elem.css(cssData);
		}
		$elem.on('transitionend.'+constent.name,function(){
			$elem.css(hack+'transition','transform 0.0ms linear');
			$elem.off('transitionend.'+constent.name);
			console.log('transition');
		});
	};
	
	// 开启移动
	$.fn.blzMove=function(option){
		this.data(constent.petName,new Move(this[0],option));
		this.on('touchstart.'+constent.name,Move.prototype.touchStart);
		this.on('touchend.'+constent.name,Move.prototype.touchEnd);
	};
	
	// 关闭移动
	$.fn.blzOffMove=function(){
		this.removeData(constent.petName);
		this.off('touchstart.blzmove touchend.blzmove');	
	};
	return $;
});