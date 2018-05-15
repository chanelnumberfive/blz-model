/*
 * h5动画交互
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jquery','iscroll'],function ($,IScroll) {
		return fn($,IScroll);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(require('./jquery.js'),require('./iscroll.js'));
	}else{
		fn(window.jQuery,window.IScroll);
	}
	/* jshint ignore:end */
})(function($,IScroll){
	'use strict';
	
	var emptyFn=function(){},
		constant={
			name:'blzDownUpAjax',
			petName:'blz-down-up-ajax',
			version:'20170607'
		},
		config={
			downAjaxFn:emptyFn,
			upAjaxFn:emptyFn,
			click:true,
			//disableMouse: true,
    		//disablePointer: true,
			probeType:3
		};
	
	// 构造函数
	function DUajax(option){
		return $.extend({},config,option||{});
	}
	
	// 上拉加载
	
	// 开启上拉刷新下拉加载
	$.fn[constant.name]=function(option){
		
		this[constant.name+'Off']();
		
		// 禁止原生滚动
		$(document).on('touchmove.'+constant.name,function(e){
			e.preventDefault();
		});
		return this.each(function(){
			var data=new DUajax(option),
				$this=$(this),
				ajaxFn=data.ajaxFn;
			
			data.iscrollInstance=new IScroll(this,data);
			
			data.iscrollInstance.on('scroll',function(){
				ajaxFn(this,data,$this);
			});
			
			$this.data(constant.petName,data);
			
		});
	};
	
	// 关闭
	$.fn[constant.name+'Off']=function(){
		$(document).off('touchmove.'+constant.name);
		
		return this.each(function(){
			var $this=$(this),
				data=$this.data(constant.petName);
			
			if(data){
				data.iscrollInstance.destroy();
				data.iscrollInstance=null;	
			}
			$this.removeData(constant.petName).off();
		});
	};
	
	return $;
});