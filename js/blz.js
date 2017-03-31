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
			if (!w.requestAnimationFrame) {
				w.requestAnimationFrame=w.webkitRequestAnimationFrame||w.mozRequestAnimationFrame||w.oRequestAnimationFrame ||w.msRequestAnimationFrame||function(callback) {
					w.setTimeout(callback, 1000/60);
				};
				return w.requestAnimationFrame;
			}else{
				return w.requestAnimationFrame;
			}
  		},
		
		//
		customEvent:function(elem,name,data){
			var event = d.createEvent('CustomEvent');
			event.initCustomEvent(name,true,false,data);
			elem.dispatchEvent(event);
		},
		
		/*
		 * 动画相关
		 */
		
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