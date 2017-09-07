;(function($){
	'use strict';
	
	return {
		name:'main-nav',
		data:function(){
			return {
				selectIndex:0
			};
		},
		template:'<div class="glb-full-box layout-tr">'+
					'<nav class="model-nav-main">'+
						'<ul>'+
							'<li v-bind:class="getNavId===\'userAd\'?\'active mnmain-item\':\'mnmain-item\'">'+
								'<router-link to="/mainNav/userAd">用户管理</router-link>'+
							'</li>'+
							'<li v-bind:class="getNavId===\'personalOffice\'?\'active mnmain-item\':\'mnmain-item\'">'+
								'<router-link to="/mainNav/personalOffice">个人办公</router-link>'+
							'</li>'+
							'<li v-bind:class="getNavId===\'businessAd\'?\'active mnmain-item\':\'mnmain-item\'">'+
								'<router-link to="/mainNav/businessAd">业务管理</router-link>'+
							'</li>'+
							'<li v-bind:class="getNavId===\'loanedAd\'?\'active mnmain-item\':\'mnmain-item\'">'+
								'<router-link to="/mainNav/loanedAd">贷后管理</router-link>'+
							'</li>'+
						'</ul>'+
					'</nav>'+
					'<div class="mnmain-content layout-td layout-tr">'+
						'<router-view></router-view>'+
					'</div>'+
				'</div>',
		methods:{
			changeSelectIndex:function(e){
				if(window.jQuery(e.target).is('a')){
					this.selectIndex=parseInt(e.target.dataset.index);
				}
			}
		},
		computed:{
			getNavId:function(){
				return this.$route.path.split('/')[2];
			}
		},
		created:function(){
			this.loading=true;
		},
		beforeDestroy:function(){
			
		}
	};
})(window.jQuery);