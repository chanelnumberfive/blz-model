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
		this.config=$.extend(config,option||{});
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
				if($(e.target).closest('[data-cartoon]').length===0&&$(e.target).closest('[data-cartoon-toggle]').length===0){
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
		
		this.on('click.cartoonShow','[data-cartoon]',function(){
			cartoonShow($(this.dataset.cartoon),className);
		}).on('click.cartoonDismiss','[data-cartoon-dismiss]',function(){
			cartoonDismiss($(this.dataset.cartoonDismiss),className);
		}).on('click.cartoon','[data-cartoon-toggle]',function(){
			var $target=$(this.dataset.cartoonToggle);
			if($target.is('.animation')){
				cartoonDismiss($target,className);
			}else {
				cartoonShow($target,className);
			}
		});	
	};
	
	
	// 动画组件卸载
	$.cartoonOff=function(){
		cartoonDismiss(animationPrev?animationPrev:$());
		$(document).off('click.cartoonShow click.cartoonDismiss click.cartoon');
		$.cartoonOff=null;
	};
	
	return $;
});