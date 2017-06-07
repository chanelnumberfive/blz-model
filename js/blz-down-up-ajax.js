/*
 * h5动画交互
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery','iscroll','blz'],function ($,IScroll) {
		return fn(window.jQuery,IScroll);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(window.jQuery,window.IScroll);
	}
	/* jshint ignore:end */
})(function($,IScroll){
	'use strict';
	
	var constant={
			name:'blzDownUpAjax',
			petName:'blz-down-up-ajax',
			version:'20170607'
		},
		config={
			downAjax:true,
			upAjax:true,
			click:true,
			//disableMouse: true,
    		//disablePointer: true,
			scroll:false,
			probeType:2
		};
	
	// 构造函数
	function DUajax(option){
		return $.extend({},config,option||{});
	}
	
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
				iscrollInstance=null;
			
			iscrollInstance=data.iscrollInstance=new IScroll(this,data);
			
			if(data.scroll){
				iscrollInstance.on('scroll',data.scroll);
			}
			
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