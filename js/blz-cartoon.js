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
	
	var animationPrev=null,
		config={
			cartoonClass:'animation'
		};
	
	// 卡通构造函数
	function Cartoon(option){
		return $.extend(true,this,config,option||{});
	}
	
	function cartoonDismiss($target,className){
		if($target.is('.'+className)){
			$target.removeClass(className).trigger('offAnimation');
			$(document).off('click.offAnimation');
			animationPrev=null;	
		}
	}
	
	function cartoonShow($target,className){
		animationPrev=animationPrev?animationPrev:$();
		
		// 防止动画重复关闭
		if($target[0]!==animationPrev[0]){
			cartoonDismiss(animationPrev,className);
		}
		
		if(!$target.is('.'+className)){
			$target.addClass(className).trigger('animation');
			$(document).on('click.offAnimation',function(e){
				var $Control=$(e.target).closest('[data-blz-cartoon]'),
					data=$Control[0]?$Control[0].dataset.blzCartoon.split(' '):[];
				if(data[1]!=='open'){
					cartoonDismiss(animationPrev?animationPrev:$(),className);
				}
			});
			animationPrev=$target;
		}
	}
	
	// 开启h5动画
	$.fn.blzCartoon=function(option){
		var className=(option||{}).cartoonClass||'animation';
		
		this.data('blz-cartoon',new Cartoon(option));
		
		this.on('click.blzCartoon','[data-blz-cartoon]',function(){
			var data=this.dataset.blzCartoon.split(' '),
				$target=$(data[0]);

			if(data[1]==='open'){
				cartoonShow($target,className);
			}else if(data[1]==='off'){
				cartoonDismiss($target,className);
			}else{ 
				if($target.is('.'+className)){
					cartoonDismiss($target,className);
				}else {
					cartoonShow($target,className);
				}
			}
			
		});
	};
	
	// 关闭h5动画
	$.fn.blzOffCartoon=function(){
		this.removeData('blz-cartoon');
		this.off('click.cartoonShow click.cartoonDismiss click.cartoon');
	};
	
	// 动画组件卸载
	$.cartoonOff=function(){
		cartoonDismiss(animationPrev?animationPrev:$());
		$(document).off('click.cartoonShow click.cartoonDismiss click.cartoon');
		$.cartoonOff=null;
	};
	
	return $;
});