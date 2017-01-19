/*
 * weui对话框
 */
;((function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd){
	  define(['jQuery'],function (empty){
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

	$.weui={};
	var modelAlert={
			model:'',
			hidden:true,
			cache:[]
		},
		modelConfirm={
			model:'',
			hidden:true,
			cache:[]
		},
		modelWarn={
			model:'',
			cache:[]
		},
		loading='',
		modelTip={
			model:'',
			hidden:true,
			cache:[]
		};

	// 缓存的弹窗数据处理
	function bindCache(model,cache,callback,time){
		time=time||0;
		model.on('click.blz',function(){
			setTimeout(function(){
				callback(cache[0]);
				cache.shift();
				if(cache.length<=0){
					model.off('click.blz');
				}
			},time);
		});
	}

	$.weui.alert=function(obj){
		var model=modelAlert.model;
		obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
		if(model!==''&&model.css('display')!=='none'){
			var cache=modelAlert.cache;

			// 假如弹窗已存在,将弹窗数据缓存；
			cache[cache.length]=obj;

			model.off('click.blz');
			bindCache(model,cache,$.weui.alert,300);
			return model;
		}else if(model!==''){
			model.find('.weui_dialog_title').html(obj.title);
			model.find('.weui_dialog_bd').html(obj.article);
			model.fadeIn(300);
		}else{
			model='<div id="weui_dialog_alert" class="weui_dialog_alert" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
				  '<div class="weui_mask"></div>'+
				  '<div class="weui_dialog">'+
					  '<div class="weui_dialog_hd">'+
						  '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
					  '</div>'+
					  '<div class="weui_dialog_bd">'+obj.article+'</div>'+
					  '<div class="weui_dialog_ft">'+
						  '<a href="javascript:void(0);" class="weui_btn_dialog primary" data-blz-dismiss="#weui_dialog_alert">确定</a>'+
					  '</div>'+
				  '</div>'+
				  '</div>';
			modelAlert.model=model=$(model).appendTo(document.body);
		}
		if(obj.sureCallback){
			model.find('.weui_btn_dialog').on('click.blz',function(){
				obj.sureCallback();
				$(this).off('click.blz');
			});
		}
		return model;
	};

	$.weui.confirm=function(obj){
		var model=modelConfirm.model;
		obj=obj||{};
		obj.title=obj.title||'温馨提示';
		obj.article=obj.article||'';
		obj.cancelText=obj.cancelText||'取消';
		obj.sureText=obj.sureText||'确定';
		obj.sureHref=obj.sureHref||'javascript:void(0);';
		obj.cancelHref=obj.cancelHref||'javascript:void(0);';

		if(model!==''&&model.css('display')!=='none'){
			var cache=modelConfirm.cache;

			// 假如弹窗已存在,将弹窗数据缓存；
			cache[cache.length]=obj;

			model.off('click.blz');
			bindCache(model,cache,$.weui.confirm,300);
			return model;
		}else if(model!==''){
			model.find('.weui_dialog_title').html(obj.title);
			model.find('.weui_dialog_bd').html(obj.article);
			model.find('.weui_btn_dialog.default').html(obj.cancelText).attr('href',obj.cancelHref);
			model.find('.weui_btn_dialog.primary').html(obj.sureText).attr('href',obj.sureHref);
			model.fadeIn(300);
		}else{
			model='<div id="weui_dialog_confirm" class="weui_dialog_confirm" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
							'<div class="weui_mask"></div>'+
							'<div class="weui_dialog">'+
								'<div class="weui_dialog_hd">'+
									'<strong class="weui_dialog_title">'+obj.title+'</strong>'+
								'</div>'+
								'<div class="weui_dialog_bd">'+obj.article+'</div>'+
								'<div class="weui_dialog_ft">'+
									'<a href="'+obj.cancelHref+'" class="weui_btn_dialog default" data-blz-dismiss="#weui_dialog_confirm" data-blz-option="cancell">'+obj.cancelText+'</a>'+
									'<a href="'+obj.sureHref+'" class="weui_btn_dialog primary" data-blz-dismiss="#weui_dialog_confirm" data-blz-option="sure">'+obj.sureText+'</a>'+
								'</div>'+
							'</div>'+
						 '</div>';
			modelConfirm.model=model=$(model).appendTo(document.body);
		}


		if(obj.cancelCallback){
			$(document).on('clickBlzOptioncancel',function(e){
				obj.cancelCallback(e);
				$(document).off('clickBlzOptionsure clickBlzOptioncancel click.sure.cancel');
			});
		}
		if(obj.sureCallback){
			$(document).on('clickBlzOptionsure',function(e){
				obj.sureCallback(e);
				$(document).off('clickBlzOptionsure clickBlzOptioncancel click.sure.cancel');
			});
		}

		// 确定取消按钮
		$(document).on('click.sure.cancel',function(){
			var data=$(this).data('blz-option');
			data=data?data:'cancel';
			setTimeout(function(){
				$(document).trigger('clickBlzOption'+data);
			},30);
		});
		return model;
	};

	$.weui.loading=function(string){
		if(!navigator.onLine){
			$.weui.tip('无网络');
			return null;
		}
		string=string||'数据加载中';
		if(loading!==''){
			loading.css('display','block').find('.weui_toast_content').html(string);
		}else{
			loading='<div id="loadingToast" class="weui_loading_toast" style="display: none;">'+
						'<div class="weui_mask_transparent"></div>'+
						'<div class="weui_toast">'+
							'<i class="weui_loading weui_icon_toast"></i>'+
							'<p class="weui_toast_content">'+string+'</p>'+
						'</div>'+
					'</div>';
			loading=$(loading).appendTo(document.body).css('display','block');
		}
		return loading;
	};

	$.weui.partLoading=function(elem,string){
		if(!navigator.onLine){
			$.weui.tip('无网络');
			return false;
		}
		string=string||'数据加载中';
		string='<div class="weui_toast model-part-loading">'+
					'<i class="weui_loading weui_icon_toast"></i>'+
					'<p class="weui_toast_content">'+string+'</p>'+
				'</div>';
		return $(string).appendTo(elem);
	};

	$.weui.warn=function(obj){
		var model=modelWarn.model;
		var cache=modelWarn.cache;

		obj.article=obj.article||'';
		obj.title=obj.title||'警告';

		if(model!==''&&model.css('display')!=='none'){

			// 假如弹窗已存在,将弹窗数据缓存；
			cache[cache.length]=obj;
			return model;
		}else if(model!==''){
			model.html(obj.title+'：'+obj.article).fadeIn();
		}else {
			model='<div class="weui_toptips weui_warn js_tooltips">'+obj.title+'：'+obj.article+'</div>';
			modelWarn.model=model=$(model).appendTo(document.body).fadeIn();
		}

		setTimeout(function(){
			model.fadeOut(0);

			// 小于零则关闭warn弹窗的反复调用大于0则开启
			if(cache.length>0){
				$.weui.warn(cache[0]);
				cache.shift();
			}
		},3000);

		return model;
	};

	$.weui.tip=function(string){
		var model=modelTip.model;
		var cache=modelTip.cache;

		string=string||'';
		if(model!==''&&model.css('display')!=='none'){

			// 假如弹窗已存在,将弹窗数据缓存；
			cache[cache.length]=string;
			return model;
		}else if(model!==''){
			model.html(string).fadeIn();
		}else {
			model='<div class="glb_weui_toast weui_toast" style="padding-top:1em;">'+string+'</div>';
			modelTip.model=model=$(model).appendTo(document.body);
		}
		setTimeout(function(){ 
		   $(model).fadeOut(0);

		   // 小于零则关闭tip弹窗的反复调用大于0则开启
		   if(cache.length>0){
				$.weui.tip(cache[0]);
				cache.shift();
			}
		},3000);

		return model;
	};   
	// dismiss交互
	$(document).on('click.blz.dismiss','[data-blz-dismiss]',function(){
		var target=$(this).attr('data-blz-dismiss');
		$(target).fadeOut(0);
	});

	// show交互
	$(document).on('click.blz.show','[data-blz-show]',function(){
		var target=$(this).attr('data-blz-show');
		$(target).fadeIn(300);
	});

	// 组件卸载
	$.weuiOff=function(){
		$.weui=null;
		$(document).off('click.blz.dismiss click.blz.show');
		if(modelAlert.model!==''){modelAlert.model.remove();}
		if(modelConfirm.model!==''){modelConfirm.model.remove();}
		if(modelWarn.model!==''){modelWarn.model.remove();}
		if(loading!==''){loading.remove();}
		if(modelTip.model!==''){modelTip.model.remove();}
		$.weuiOff=null;
	};
}));