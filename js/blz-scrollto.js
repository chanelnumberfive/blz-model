/*
 * 缓冲滚动
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd){
	  define(['blz'],function (empty){
		  return fn(window.jQuery);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(window.jQuery);
	}
	/* jshint ignore:end */
}(function($){
	'use strict';

	var config={
		displacement:0,
		time:300,
		scrollMethod:'scrollTop',
		callback:$.blz.emptyFn
	};

	function scrollTo(elem,s,top,time,oldTime,direction,callback){
		var time1=+new Date()-oldTime,
			time2=time1>time?time:time1,
		    scrollValue=top*time2/time;
		elem[direction]=s+scrollValue;
		if(time1<=time&&Math.abs(scrollValue)<=Math.abs(top)){
			window.requestAnimationFrame(function(){
				scrollTo(elem,s,top,time,oldTime,direction,callback);
			});
		}else{
			callback();
		}
	}
	$.fn.blzScrollto=function(obj){
		var option=$.extend({},config,obj);
		return this.each(function(){
			scrollTo(this,this[option.scrollMethod],option.displacement,option.time,+new Date(),option.scrollMethod,option.callback);
		});
	};
	return $;
}));	