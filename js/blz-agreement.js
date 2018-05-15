/*
 * 条款交互
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['blz-dialog'],function ($) {
		return fn($);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(require('./blz-dialog.js'));
	}else{
		fn(window.jQuery);
	}
	/* jshint ignore:end */
}(function($){
	'use strict';
    
	var modelAgreement='<div class="blz-mask" id="blz-mask" data-blz-dismiss="#blz-mask">'+
							'<span class="blz-close"></span>'+
							'<div id="blz-agreement-wrapper">'+
								
							'</div>'+
						'</div>';
	
	// 弹层构造函数
	function GetAgreement(){
		
	}
	
	// 加载图片
	GetAgreement.prototype.getImage=function(data){
		var b=[],
			i=0,
			length=data.length,
			l=length,
			frag=document.createDocumentFragment(),
			loading=$.weui.loading();
		
		for(;i<length;i++){
			b[i]=new Image();
			b[i].onload=function(){
				l--;
				if(l<=0){
					for(var i=0; i<b.length;i++){
						frag.appendChild(b[i]);
					}
					modelAgreement=$(modelAgreement).appendTo(document.body);
					$('#blz-agreement-wrapper').html('').append(frag);
					$('#blz-mask').show();
					loading.hide();
				}
			};
			b[i].src=data[i];	
		}
	};
	
    // 获取参数
	GetAgreement.prototype.getUrl=function(elem){
		var datas=elem.dataset.blzAgreement,
		    url=datas.split(' ');
		return url;
	};
	
	// 开启协议
	$.fn.blzGetAgreement=function(){
		return this.on('click.blzAgreement','[data-blz-agreement]',function(e){
			
			// 阻止html元素默认行为
			e.preventDefault();
			
			var url=GetAgreement.prototype.getUrl(e.target);
			GetAgreement.prototype.getImage(url);
		});
	};
	
	// 关闭协议
	$.fn.blzOffGetAgreement=function(){
		return this.off('click.blzAgreement');
	};
	
	// 组件卸载
	$.blzOffGetAgreement=function(selector){
		$(selector).off('click.blzAgreement');
		$(modelAgreement).remove();
		$.blzOffAgreement=null;
	};
	
	return $;
}));