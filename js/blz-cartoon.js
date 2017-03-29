/*
 * h5动画交互
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
		fn(window.jQuery);
	}
	/* jshint ignore:end */
})(function($){
	'use strict';
	
	var constant={
		name:'blzCartoon',
		version:'20170307-1.0',
		eventNameOn:'animation',
		eventNameOff:'offAnimation',
		cartoonAPI:'[data-blz-cartoon]',
		cartoonOn:'on',
		cartoonOff:'off',
		cartoonToggle:'toggle',
		switcher:'blz-cartoon-switcher'
	};

	var animationPrev=null,
		config={
			cartoonClass:'animation',
			constant:constant
		};	
	
	// 卡通构造函数
	function Cartoon(option){
		return $.extend(true,this,config,option||{});
	}
	
	Cartoon.prototype.hide=function(data,switcher){
		var constant=null,
			eventName='',
			className=data.cartoonClass;

		if(animationPrev){
			constant=data.constant;
			eventName=constant.eventNameOff;
			animationPrev.removeClass(className).data(constant.switcher,switcher).trigger(eventName);
			animationPrev=null;	
		}
	};
	
	Cartoon.prototype.show=function($target,data,switcher){

		var constant=data.constant,
			className=data.cartoonClass;

		// 防止动画重复开启
		if(animationPrev&&animationPrev.data(constant.switcher)[0]!==switcher[0]){
			data.hide(data,[switcher[0],constant.cartoonOff]);
		}
		
		if(!$target.is('.'+className)){
			$target.addClass(className).data(constant.switcher,switcher).trigger(constant.eventNameOn);
			animationPrev=$target;
		}
	};
	
	// 开启h5动画
	$.fn.blzCartoon=function(option){
		var data=new Cartoon(option),
			constant=data.constant,
			className=data.cartoonClass;
		
		this.data(constant.name,data);
		
		return this.blzCartoonOff().on('click.'+constant.name,function(e){
			var elem=$(e.target).closest(constant.cartoonAPI)[0],
				element=elem?elem:e.target,
				apiData=(element.dataset[constant.name]||'').split(' '),
				$target=$(apiData[0]);

			if(apiData[1]===constant.cartoonOn){
				data.show($target,data,[element,constant.cartoonOn]);
			}else if(apiData[1]===constant.cartoonToggle){ 
				if($target.is('.'+className)){
					data.hide($target,data,[element,constant.cartoonOff]);
				}else {
					data.show($target,data,[element,constant.cartoonOn]);
				}
			}else{
				data.hide(data,[element,constant.cartoonOff]);
			}
		});
	};
	
	// 关闭h5动画
	$.fn.blzCartoonOff=function(){
		var data=this.data('blz-cartoon')||config;
		var constant=data.constant;

		return this.removeData(constant.name).off('click.'+constant.name);
	};
	
	return $;
});