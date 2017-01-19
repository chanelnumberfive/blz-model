/*
 * 缓冲滚动
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd){
	  define(['jQuery'],function (empty){
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

	function scrollTo(elem,s,top,time,oldTime,callback){
		var time1=+new Date()-oldTime,
			time2=time1>time?time:time1,
		    scrollValue=top*time2/time;
		elem.scrollTop=s+scrollValue;
		if(time1<=time&&Math.abs(scrollValue)<=Math.abs(top)){
			window.requestAnimationFrame(function(){
				scrollTo(elem,s,top,time,oldTime,callback);
			});
		}else{
			callback();
		}
	}
	$.fn.scrollTo=function(displacement,time,callback){
		displacement=displacement?displacement:0;
		time=time?time:300;
		callback=callback?callback:$.blz.emptyFunciton;
		return this.each(function(){
			scrollTo(this,this.scrollTop,displacement,time,+new Date(),callback);
		});
	};
	return $;
}));	