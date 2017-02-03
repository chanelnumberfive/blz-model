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
	
	$.blz={
		
		// 空函数
		emptyFn:function(){},
		
		// 获取数据类型
		getDataType:function(data){
			return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
		},
		
		// 获取用户代理ios 或 android
		isAndroid:/Android/gi.test(navigator.userAgent),
		
		// 检测动画属性transition的支持情况
		checkTransition:function(){
			var o=document.createElement('div');
			var a=[['','transition',''],['webkit','Transition','-'],['ms','Transition','-'],['Moz','Transition','-'],['O','Transition','-']];
			for(var i=a.length-1;i>=0;i--){
				if(a[i][0]+a[i][1] in o.style){
					return a[i][2]+a[i][0].toLowerCase()+a[i][2];
				}else if(i===0){
					return false;
				}
			}
		},
		
		// 动画帧函数的兼容处理
		requestAnimationFrame:function(){
			if (!window.requestAnimationFrame) {
				window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame ||window.msRequestAnimationFrame||function(callback) {
					window.setTimeout(callback, 1000/60);
				};
				return window.requestAnimationFrame;
			}else{
				return window.requestAnimationFrame;
			}
  		}
	};
	return $;
}));