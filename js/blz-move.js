;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['blz-gesture'],function ($) {
		return fn($);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(require('./blz-gesture.js'));
	}else{
		fn(window.jQuery);
	}
	/* jshint ignore:end */
})(function($){
	'use strict';
	
	var constant={
		name:'blzMove',
		off:'blzMoveOff',
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
	Move.prototype.translationStart=function(e){
		var event=e.detail,
			$this=$(this),
			data=$this.data(constant.petName);
		data.x=event.pageX;
		data.y=event.pageY;
		$this.on('translation.'+constant.name,Move.prototype.translation);
	};
	
	// 移动中
	Move.prototype.translation=function(e){
		var event=e.detail,
			$this=$(this),
			data=$this.data(constant.petName);
		data.dx=event.pageX-data.x;
		data.dy=event.pageY-data.y;
		data.shiftX=data.dx+data.prevDx<data.minShiftX?data.minShiftX:(data.dx+data.prevDx>data.maxShiftX?data.maxShiftX:data.dx+data.prevDx);
		data.shiftY=data.dy+data.prevDy<data.minShiftY?data.minShiftY:(data.dy+data.prevDy>data.maxShiftY?data.maxShiftY:data.dy+data.prevDy);
		$this.css(hack+'transform','translate('+data.shiftX+'px,'+data.shiftY+'px)');
	};
	
	// 移动结束
	Move.prototype.translationEnd=function(){
		var $this=$(this),
			data=$this.data(constant.petName);
		data.prevDx=data.shiftX;
		data.prevDy=data.shiftY;
		data.dx=data.dy=data.x=data.y=0;
		$this.off('translation.'+constant.name);
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
		$elem.on('transitionend.'+constant.name,function(){
			$elem.css(hack+'transition','transform 0.0ms linear');
			$elem.off('transitionend.'+constant.name);
			console.log('transition');
		});
	};
	
	// 开启移动
	$.fn[constant.name]=function(option){
		return this.each(function(){
			$(this).blzGesture({translation:true}).data(constant.petName,new Move(this,option))
			.on('translationstart.'+constant.name,Move.prototype.translationStart)
			.on('translationend.'+constant.name,Move.prototype.translationEnd);
		});
	};
	
	// 关闭移动
	$.fn[constant.off]=function(){
		return this.removeData(constant.petName).off('translationstart.'+constant.name+' translationend.'+constant.name);	
	};
	return $;
});