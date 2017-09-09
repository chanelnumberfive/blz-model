/*
 * blz模块声明
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery'],function () {
		return fn(window.Zepto||window.jQuery);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.Zepto||window.jQuery);
	}else{
		fn(window.Zepto||window.jQuery);
	}
	/* jshint ignore:end */
}(function($){
	'use strict';
	
	function time(start,format,tip){
		time.executeTime=+new Date();
		format=format?format:60;
		timeElem.textContent=start;
		var a=(start+'').split(':');
		a[2]=a[2]-0+1;
		a[1]-=0;
		a[0]-=0;
		if(time.sum>=1000){
			a[2]+=parseInt(time.sum/1000);
			time.sum%=1000;
		}
		if(a[2]>=format){
			a[1]+=parseInt(a[2]/format);
			a[2]%=format;	
		}
		if(a[1]>=format){
			a[0]+=parseInt(a[0]/format);
			a[1]%=format;
		}
		var b=a.map(function(value,index){
			return value<=9?'0'+value:value;
		});
		if(tip){
			time.sum=0;
			time.timer=setTimeout(function(){
				time(b.join(':'),format);
			},1000);
		}else{
			time.sum+=((time.executeTime-time.preExecuteTime)-1000);
			time.timer=setTimeout(function(){
				time(b.join(':'),format);
			},1000);
		}
		time.preExecuteTime=time.executeTime;
	}
	
	return $;
}));