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
	
	var w=window,
		d=document;
	
	// 初始化requestAnimationFrame
	(function(){
		if (!w.requestAnimationFrame) {
			w.requestAnimationFrame=w.webkitRequestAnimationFrame||w.mozRequestAnimationFrame||w.oRequestAnimationFrame ||w.msRequestAnimationFrame||function(callback) {
				return w.setTimeout(callback, 1000/60);
			};
		}
	})();
	
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
			var o=d.createElement('div');
			var a=[['webkit','Transition','-'],['ms','Transition','-'],['Moz','Transition','-'],['O','Transition','-'],['','transition','']];
			for(var i=0;i<a.length;i++){
				if(a[i][0]+a[i][1] in o.style){
					return a[i][2]+a[i][0].toLowerCase()+a[i][2];
				}else if(i===4){
					alert('您的浏览器版本过低请升级浏览器');
				}
			}
		},
		
		// 自定义事件
		customEvent:function(elem,name,data){
			var event = d.createEvent('CustomEvent');
			event.initCustomEvent(name,true,false,data);
			elem.dispatchEvent(event);
		},
		
		// 转换成字面量
		toString:function(val){
		  return val == null? '': typeof val === 'object'? JSON.stringify(val, null, 2): String(val);
		}
	};
	return $;
}));