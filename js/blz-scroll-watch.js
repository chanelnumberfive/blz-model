/*
 * 缓冲滚动
 */
;
(function (fn) {
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
		define(['blz-scrollto'], function (empty) {
			return fn(window.jQuery);
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = fn(window.jQuery);
	} else {
		fn(window.jQuery);
	}
	/* jshint ignore:end */
}(function ($) {
	'use strict';
	var constant={
		name:'blzScrollWatch',
		petName:'blz-scroll-watch',
		remove:'blzOffScrollWactch',
		version:20170830
	},
	   config = {
		interval:60,
		onScrollWatch: $.blz.emptyFn,  
		timer:null,
		navElems:[],
		watchElems:[]   
	};

	// scroll
	function scrollTo(selector,$scroller) {
		var top = document.getElementById(selector).getBoundingClientRect().top;
		
		$scroller.blzScrollto({
			displacement: top,
			time: Math.abs(top) >= 600 ? 600 : Math.abs(top)
		});
	}

	// watcher
	function watcher(elems,fn) {
		var i = 1,
			p = {},
			h = window.innerHeight / 2,
			l=elems.length;
		for (; i <l; i++) {
			p = elems[i].getBoundingClientRect();
			if (h > p.top && h < p.bottom) {
				fn(elems[i]);
				break;
			}
		}
	}
	
	$.fn[constant.name]=function(obj){
		this[constant.remove]();
		return this.each(function(){
			var data=$.extend({},config,obj),
				$this=$(this);
			$this.data(constant.petName,data);
			
			$this.on('scroll.'+constant.name,function(){
				clearTimeout(data.timer);
				data.timer=setTimeout(function(){
					watcher(data.watchElems,data.onScrollWatch);
				},data.interval);
			});
			
			$(data.navElems).on('click.'+constant.name,function(){
				$(data.navElems).removeClass('active');
				$(this).addClass('active');
				scrollTo(this.dataset[constant.name],$this);
			});
		});	
	};
	$.fn[constant.remove]=function(){
		return this.each(function(){
			var data=$(this).data(constant.petName)||{},
				$this=$(this);
			$this.off('scroll.'+constant.name);
			$(data.navElems).off('click.'+constant.name);
		});
	};
	
	return $;
}));
