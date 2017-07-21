/*
 * blz模块声明
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery'],function () {
		return fn(window.jQuery||window.Zepto);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery||window.Zepto);
	}else{
		fn(window.jQuery||window.Zepto);
	}
	/* jshint ignore:end */
}(function($){
	'use strict';
	
	var w=window,
		d=document;
	
	// 初始化requestAnimationFrame接口；
	(function(){
		if (!w.requestAnimationFrame) {
			w.requestAnimationFrame=w.webkitRequestAnimationFrame||w.mozRequestAnimationFrame||w.oRequestAnimationFrame ||w.msRequestAnimationFrame||function(callback) {
				w.setTimeout(callback, 1000/60);
			};
			return w.requestAnimationFrame;
		}else{
			return w.requestAnimationFrame;
		}
	})();
	
	$.blz={
		// webGl初始化
		initWebGl:function(canvas){
			var context3d=null;
			try{
				context3d=canvas.getContext('webgl')||canvas.getContext('experimental-webgl');
			}catch(e){
				throw new Error('你的浏览器不支持WebGl');
			}
			return context3d;
		}
	};
	return $;
}));