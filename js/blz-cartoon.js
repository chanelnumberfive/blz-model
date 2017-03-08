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
		switcher:'blz-cartoon-switcher'
	}

	var animationPrev=null,
		config={
			cartoonClass:'animation',
			constant:constant
		};	
	
	// 卡通构造函数
	function Cartoon(option){
		return $.extend(true,this,config,option||{});
	}
	
	Cartoon.prototype.hide=function($target,data,switcher){
		var constant=null,
			eventName='',
			className=data.cartoonClass;

		if($target.is('.'+className)){
			constant=data.constant;
			eventName=constant.eventNameOff;
			$target.removeClass(className).data(constant.switcher,switcher).trigger(eventName);
			$(document).off('click.'+eventName);
			animationPrev=null;	
		}
	};
	
	Cartoon.prototype.show=function($target,data,switcher){
		animationPrev=animationPrev?animationPrev:$();

		var constant=data.constant,
			className=data.cartoonClass,
			$Control=null,
			apiData=null,
			array=$target.data(constant.switcher)||[],
			target=array[0];

		// 防止动画重复关闭
		if(target!==switcher[0]){
			data.hide(animationPrev,data,[switcher[0],constant.cartoonOff]);
		}
		
		if(!$target.is('.'+className)){
			$target.addClass(className).data(constant.switcher,switcher).trigger(constant.eventNameOn);
			$(document).on('click.'+constant.eventNameOff,function(e){
				$Control=$(e.target).closest(constant.cartoonAPI),
				apiData=$Control[0]?$Control[0].dataset[constant.name].split(' '):[];
				if(apiData[1]!==constant.cartoonOn){
					data.hide(animationPrev?animationPrev:$(),data,[e.target,constant.cartoonOff]);
				}
			});
			animationPrev=$target;
		}
	}
	
	// 开启h5动画
	$.fn.blzCartoon=function(option){
		var data=new Cartoon(option),
			constant=data.constant,
			apiData=null,
			$target=null,
			className=data.cartoonClass;
		
		this.data(constant.name,data);
		
		return this.on('click.'+constant.name,constant.cartoonAPI,function(){
			apiData=this.dataset[constant.name].split(' '),
			$target=$(apiData[0]);

			if(apiData[1]===constant.cartoonOn){
				data.show($target,data,[this,constant.cartoonOn]);
			}else if(apiData[1]===constant.cartoonOff){
				data.hide($target,data,[this,constant.cartoonOff]);
			}else{ 
				if($target.is('.'+className)){
					data.hide($target,data,[this,constant.cartoonOff]);
				}else {
					data.show($target,data,[this,constant.cartoonOn]);
				}
			}
			
		});
	};
	
	// 关闭h5动画
	$.fn.blzOffCartoon=function(data){
		data=data||this.data('blz-cartoon')||config;
		var constant=data.constant;

		return this.removeData(constant.name).off('click.'+constant.name);
	};
	
	return $;
});