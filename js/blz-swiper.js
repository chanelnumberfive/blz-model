/*
 * 轮播图插件
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery','blz-finger'],function ($,finger) {
		return fn(window.jQuery,finger);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(window.jQuery);
	}
	/* jshint ignore:end */
})(function($,finger){
	'use strict';
	
	
	return $;
});