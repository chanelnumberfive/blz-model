/*
 * blz模块声明
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery'],function () {
		return fn(window.jQuery);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(widnow.jQuery);
	}
	/* jshint ignore:end */
}(function($){
	'use strict';
	
	$.blz={};
	$.blz.emptyFunciton=function(){};
	$.blz.getDataType=function(data){
		return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
	};
	$.blz.useragent=/Android/gi.test(navigator.userAgent);
	$.blz.checkBrowerKernel=function(){
		var o=document.createElement('div');
		var a=[['','transition',''],['webkit','Transition','-'],['ms','Transition','-'],['Moz','Transition','-'],['O','Transition','-']];
		for(var i=a.length-1;i>=0;i--){
			if(a[i][0]+a[i][1] in o.style){
				return a[i][2]+a[i][0].toLowerCase()+a[i][2];
			}else if(i===0){
				return '';
			}
		}
	};
	return $;
}));