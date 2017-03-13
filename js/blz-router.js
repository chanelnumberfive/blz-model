
//  h5路由
+function($){
	'use strict';

	// 组件加载程序
	$(document).on('click','[data-ajax-url]',function(e){

		// 如果浏览器不支持H5路由则直接返回取消ajax优化
		if(history.pushState){

			// 阻止页面跳转
			e.preventDefault();

			// 获取加载数据
			var url=this.dataset.ajaxUrl;
			sessionStorage.setItem('url',url);
			sessionStorage.setItem('href',this.href.split('/').pop());
			sessionStorage.setItem('container',this.dataset.ajaxContainer);
			sessionStorage.setItem('title',this.dataset.title||this.textContent||this.value);

			// 数据加载
			$.weui.loading();
			
			// 改为ajax请求
			$.ajax({
				url:url+'?t='+(new Date()).getTime(),
				success:function(data){
					$.weui.loading().hide();
					var url=sessionStorage.getItem('url');
					var href=sessionStorage.getItem('href');
					var container=sessionStorage.getItem('container');
					var title=sessionStorage.getItem('title');
					
					// 组件卸载程序
					$(container).trigger($(container).attr('data-unload-event-name'));
					document.title=title;
					$(container).html(data);
					
					// 推入历史记录
					history.pushState({
						title:title,
						url:url,
						container:container
					},title,href);
				},
				error:function(){
					$.weui.loading().hide();
					$.weui.tip('内容加载失败！');
				}
			});
		}
	});
	
	// 针对移动端浏览器初次加载主动触发popstate的bug
	window.addEventListener('load',function(){
		setTimeout(function(){
			window.addEventListener('popstate',function(e){
				var state=e.state;

				// 首次加载页面时Safari浏览器会触发popstate事件
				if(e.state){
					$.weui.loading();

					sessionStorage.setItem('container',state.container);
					sessionStorage.setItem('title',state.title);
					// 改为ajax请求
					$.ajax({
						url:state.url,
						success:function(data){
							$.weui.loading().hide();
							var container=sessionStorage.getItem('container');
							var title=sessionStorage.getItem('title');

							// 组件卸载程序
							$(container).trigger($(container).attr('data-unload-event-name'));
							document.title=title;
							$(container).html(data);

						},
						error:function(){
							$.weui.loading().hide();
							$.weui.tip('内容加载失败！');
						}
					});
				}else {
					location.reload();
				}
			},false);
		},0);
	});
}(window.jQuery);