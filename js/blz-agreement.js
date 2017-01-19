/*
 * 条款交互
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
}(function($){
	'use strict';
    
	var modelAgreement='<div class="weui_mask blz-mask" id="blz-mask" data-blz-dismiss="#blz-mask">'+
							'<span class="close"></span>'+
							'<div id="blz-wrapper">'+
								'<ul>'+
									'<li id="blz-img-box">'+
									'</li>'+
								'</ul>'+
							'</div>'+
						'</div>';
	
	$(document).on('click.pdf','[data-blz-pdf]',function(event){
		event.preventDefault();
		
        var loading=$.weui.loading(),
		    datas=$(this).data('blz-pdf'),
		    data=datas.split(' '),
		    length=data.length,
			l=length,
			b=[],
			frag=document.createDocumentFragment();
		
		for(var i=0;i<length;i++){
			b[i]=new Image();
			b[i].onload=function(){
				l--;
				if(l<=0){
					for(var i=0; i<b.length;i++){
						frag.appendChild(b[i]);
					}
					modelAgreement=$(modelAgreement).appendTo(document.body);
					$('#blz-img-box').html('').append(frag);
                    loading.hide();
					$('#blz-mask').show();
				}
			};
			b[i].src=data[i];
			
		}
	});
	
	$('#blz-img-box').on('scroll',function(e){
		e.preventDefault();
	});
	
	// 组件卸载
	$.clauseOff=function(){
		$('#blz-img-box').off('scroll');
		$(document).off('click.pdf');
		$(modelAgreement).remove();
		$.clauseOff=null;
	};
	
	return $;
}));