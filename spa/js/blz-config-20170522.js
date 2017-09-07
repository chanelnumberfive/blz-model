window.addEventListener('load', function () {
	'use strict';

	var $ = window.jQuery;
	
	// 页面加载
	function loadPage(url, fn) {
		if (navigator.online || true) {
			var ajax = new XMLHttpRequest(),
				id=setTimeout(function(){
					ajax.abort();
					$.weui.tip('Request was unsuccessful:timeout');
				},5000);
			ajax.onreadystatechange = function () {
				if (ajax.readyState === 4) {
					clearTimeout(id);
					if ((ajax.status >= 200 && ajax.status < 300) || ajax.status === 304) {
						fn((1,eval)(ajax.responseText));
					} else {
						$.weui.tip('Request was unsuccessful:' + ajax.status);
					}
				}
			};
			ajax.open('get',url+ '?' +encodeURIComponent(new Date()),true);
			ajax.send(null);
		} else {
			$.weui.tip('无网络');
		}
	}
	
	//  vue扩展
	Vue.prototype.blzGetScript=function(url,fn){
		loadPage(url,fn);
	};
	
	var routes = [
			{
				path: '/',
				redirect: '/mainNav'
			}, 
			{
				path: '/mainNav',
				component: function (resolve) {
					loadPage('page/mainNav.js', resolve);
				},
				children:[
					{
						path:'',
						redirect:'userAd'
					},
					{
						path:'userAd',
						component:function(resolve){
							loadPage('page/childNav.js',resolve);
						},
						children:[
							{
								path:'',
								redirect:'userAdItem1LineOn'
							},
							{
								path:'userAdItem1LineOn',
								component:function(resolve){
									loadPage('page/userAd/lineOn.js',resolve);
								}
							},
							{
								path:'userAdItem1LineOff',
								component:function(resolve){
									loadPage('page/userAd/lineOff.js',resolve);
								}
							},
							{
								path:'userAdItem2CooperationDoorShop',
								component:function(resolve){
									loadPage('page/userAd/doorCooperation.js',resolve);
								}
							},
							{
								path:'userAdItem3Blacklist',
								component:function(resolve){
									loadPage('page/userAd/blackList.js',resolve);
								}
							}
						]
					},
					{
						path:'personalOffice',
						component:function(resolve){
							loadPage('page/childNav.js',resolve);
						},
						children:[
							{
								path:'',
								redirect:'thingWillDo'
							},
							{
								path:'thingWillDo',
								component:function(resolve){
									loadPage('page/personalOffice/thingWillDo.js',resolve);
								}
							},
							{
								path:'thingDid',
								component:function(resolve){
									loadPage('page/personalOffice/thingDid.js',resolve);
								}
							}
						]
					},
					{
						path:'businessAd',
						component:function(resolve){
							loadPage('page/childNav.js',resolve);
						}
					},
					{
						path:'loanedAd',
						component:function(resolve){
							loadPage('page/childNav.js',resolve);
						}
					}
				]	
			}
		],
		router = new VueRouter({
			routes: routes
		}),
		systerm = new Vue({
			router: router
		}).$mount('#systerm');
});
