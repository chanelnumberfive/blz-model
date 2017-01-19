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
		fn(widnow.jQuery);
	}
	/* jshint ignore:end */
})(function($){
	'use strict';
	
	var animationPrev=null;
	
	function cartoonDismiss($target){
		$target.removeClass('animation').trigger('offAnimation');
		$(document).off('click.offAnimation');
		animationPrev=null;
	}
	
	function cartoonShow($target){
		cartoonDismiss(animationPrev?animationPrev:$());
		$target.addClass('animation').trigger('animation');
		
		$(document).on('click.offAnimation',function(e){
			if($(e.target).closest('[data-cartoon]').length===0&&$(e.target).closest('[data-cartoon-toggle]').length===0){
				$target.removeClass('animation');
				$target.trigger('offAnimation');
				$(document).off('click.offAnimation');
			}
		});
		animationPrev=$target;
	}
	
	$(document).on('click.cartoonShow','[data-cartoon]',function(){
		cartoonShow($(this.dataset.cartoon));
	});
	
	$(document).on('click.cartoonDismiss','[data-cartoon-dismiss]',function(){
		cartoonDismiss($(this.dataset.cartoonDismiss));
	});
	
	$(document).on('click.cartoon','[data-cartoon-toggle]',function(){
		var $target=$(this.dataset.cartoonToggle);
		if($target.is('.animation')){
			cartoonDismiss($target);
		}else {
			cartoonShow($target);
		}
	});
	
	// 动画组件卸载
	$.cartoonOff=function(){
		cartoonDismiss(animationPrev?animationPrev:$());
		$(document).off('click.cartoonShow click.cartoonDismiss click.cartoon');
		$.cartoonOff=null;
	};
	
	return $;
});