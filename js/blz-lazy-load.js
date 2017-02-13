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
	
	//检查元素是否进入视野
	function scrollIntoView(elem,scale){
		var position=elem.getBoundingClientRect(),
			top=position.top,
			bottom=position.bottom,
			h=window.innerHeight*scale;
		return top>top-bottom&&top<h;
	}
	
	// 懒加载构造函数
	function LazyLoad(elems,callback){
		this.elems=Array.prototype.slice.call(elems);
		this.showLoadIndex=0;
		this.callback=callback;
		this.elemsRemain=this.elems.slice();
	}
	
	// 遍历图像
	function ergodicImg(data,$this,scale,scrollIntoView){
		var i=0,
			elems=data.elems,
			l=elems.length,
			remain=data.elemsRemain,
			callback=data.callback,
			count=0,
			canBreak=false;
		for(;i<l;i++){
			if(scrollIntoView(elems[i],scale)){
				canBreak=true;
				if(callback){
					callback(elems[i]);
					remain.splice(i-count,1);
					count++;
				}else{
					elems[i].src=elems[i].dataset.src;
					remain.splice(i-count,1);
					count++;
				}
			}else{
				if(canBreak){
					return;
				}
			}
		}
		data.elems=remain.slice();
		if(data.elems.length===0){
			$this.off('scroll.blzLazyLoad');
			$this.removeData('blz-lazy-load');
		}
	}
	
	$.fn.blzLazyLoad=function(elems,scale,callback){
		scale=scale||1;
		return this.each(function(){
			var data=new LazyLoad(elems,callback),
				$this=$(this).data('blz-lazy-load',data);
			
			// 绑定时主动执行一次以保证早已位于视口内的元素显示正常
			ergodicImg(data,$this,scale,scrollIntoView);
			
			$this.on('scroll.blzLazyLoad',function(){
				console.log(1);
				ergodicImg(data,$this,scale,scrollIntoView);
			});
		});
	};
	return $;
});