/*
 * 轮播图插件
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['blz-gesture'],function ($) {
		return fn(window.Zepto||window.jQuery);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.Zepto||window.jQuery);
	}else{
		fn(window.Zepto||window.jQuery);
	}
	/* jshint ignore:end */
})(function($){
	'use strict';
	
	var constant={
		name:'blzSwiper',
		petName:'blz-swiper',
		off:'blzSwiperOff',
		version:'20170331'
	};
	
	var config={
		vertical:false,
		pageX:0,
		pageY:0,
		slideDistance:100,
		slidedDistance:0,
		slideChangeTime:300,
		slideChangeMethod:'linear',
		slideSelector:'.blz-slide',
		slideWrapperSelector:'.blz-slide-wrapper',
		slideWidth:0,
		slideLength:0,
		slideActiveIndex:0,
		slideWrapperS:0
	};
	var hack=$.blz.checkTransition().replace(/-/g,''),
		hackTransform=hack===''?'transform':hack+'Transform',
		hackTransition=hack===''?'transition':hack+'Transition',
		customEvent=$.blz.customEvent,
		abs=Math.abs;
	
	// swiper构造函数
	function Swiper(elem,option){
		var slides=null;
		
		$.extend(this,config,option||{});
		
		slides=$(elem).find(this.slideSelector);
		this.elem=elem;
		this.slideLength=slides.length;
		this.slideWidth=slides[0].getBoundingClientRect().width;
		this.XY=this.vertical?'Y':'X';
	}
	
	// 换页
	Swiper.prototype.slideChange=function(e){
		var data=e.detail;
		if(data.dxy<0){
			data.slideActiveIndex++;
		}else{
			data.slideActiveIndex--;
		}
		data.slideActiveIndex=data.slideActiveIndex<0?0:data.slideActiveIndex>data.slideLength-1?data.slideLength-1:data.slideActiveIndex;
		data.slideWrapperS=-data.slideActiveIndex*data.slideWidth;
		data.elem.style[hackTransform]='translate'+data.XY+'('+data.slideWrapperS+'px)';
		data.elem.style[hackTransition]=hackTransform+' '+data.slideChangeTime+'ms '+data.slideChangeMethod;
	};
	
	// 动画过渡结束时
	Swiper.prototype.transitionEnd=function(e){
		e.target.style[hackTransition]='';
	};
	
	Swiper.prototype.translationStart=function(e){
		var $this=$(this).off('translation.'+constant.name).on('translation.'+constant.name,function(e){
			Swiper.prototype.translation(e,data);
		}),
			data=$this.data(constant.petName);
				
		data['page'+data.XY]=e.detail['page'+data.XY];
		data.slidedDistance=0;
	};
	
	Swiper.prototype.translation=function(e,data){
		var elem=data.elem,
			XY=data.XY,
			dxy=e.detail['page'+XY]-data['page'+XY];
		
		if(data.slideActiveIndex===0&&dxy>0){
			data['translate'+XY]=data.slideWrapperS+dxy/5;	
		}else if(data.slideActiveIndex===data.slideLength-1&&dxy<0){
			data['translate'+XY]=data.slideWrapperS+dxy/5;
		}else{
			data['translate'+XY]=data.slideWrapperS+dxy;
		}
		elem.style[hackTransform]='translate'+XY+'('+data['translate'+XY]+'px)';
	};
	
	Swiper.prototype.translationEnd=function(e){
		var data=$(this).data(constant.petName),
			XY=data.XY;
			data.dxy=e.detail['page'+XY]-data['page'+XY];
		$(this).off('translation.'+constant.name);
		
		// 如果符合换页条件则进行换页
		if(abs(data.dxy)>data.slideDistance){
			customEvent(e.target,'slidechangestart',data);
		}else{
			data.elem.style[hackTransform]='translate'+data.XY+'('+data.slideWrapperS+'px)';
			data.elem.style[hackTransition]=hackTransform+' '+data.slideChangeTime+'ms '+data.slideChangeMethod;
		}
	};
	
	$.fn[constant.name]=function(option){
		option=option||{};
		return this.each(function(){
			var $this=$(this),
				$swiperWrapper=$this.find(option.slideWrapperSelector||config.slideWrapperSelector);
			
			$this[constant.off]().data(constant.petName,new Swiper($swiperWrapper[0],option))
				   .blzGesture({
						translation:true	
					})
					.on('translationstart.'+constant.name,Swiper.prototype.translationStart)
					.on('translationend.'+constant.name,Swiper.prototype.translationEnd)
					.on('slidechangestart.'+constant.name,Swiper.prototype.slideChange)
					.on('transitionend.'+constant.name,Swiper.prototype.transitionEnd);
		});
	};
	
	$.fn[constant.off]=function(){
		return this.blzGestureOff().off('pinch.'+constant.name);
	};
	
	return $;
});