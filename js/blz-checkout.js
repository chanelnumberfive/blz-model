;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery','blz'],function () {
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
	
	// 获取总额
	function getTotal(tip,elem,total){
		var symbol=tip?1:-1;
		total=total+symbol*elem.dataset.blzPrice*elem.dataset.blzAmount;
		return total;
	}
	
	// 全选功能,循环均应考虑循环优化防止程序长时间阻塞主线程
	function selectAll(elems,value){
		var length=elems.length,
			i=0;
		for(;i<length;i++){
			if(elems[i].checked!==value){
				elems[i].checked=value;
				elems.eq(i).trigger('change');
			}
		}
	}
	
	// 全选按钮
	function isSelectedAll(elem,areaSelector){
		var i=1,
			$Parent=$(elem).closest(areaSelector),
			$Total=null,
			$Elems=null,
			$Checkeds=null;
		while($Parent.length!==0){
			$Total=$Parent.find('[data-blz-checkout-level="'+i+'"]');
		    $Elems=$Parent.find('[data-blz-checkout-level="'+(i-1)+'"]');
			$Checkeds=$Elems.filter(function(){
				return this.checked;
			});
			
			if($Checkeds.length===$Elems.length){
				$Total[0].checked=true;
			}else{
				$Total[0].checked=false;
			}
			$Parent=$Parent.parent().closest(areaSelector);
			i++;
		}
	}
	
	// 加减功能
	function plusManusFn(elem,symbol){
		var step=elem.dataset.blzStep*symbol,
			$InputText=$(elem).siblings('.text'),
			val=$InputText.val()-0+step,
			min=$InputText[0].dataset.blzMin-0,
			max=$InputText[0].dataset.blzMax-0;
		val=val<min?min:val;
		val=val>max?max:val;
		$InputText.val(val);
		$InputText.trigger('change');
	}
	
	// 浏览器后退引起的总金额错误处理
	function totalCorrect(elem,obj){
		var l=elem.length,
			i=0;
		for(;i<l;i++){
			if(elem[i].dataset.blzCheckoutLevel==='0'){
				var $TextInput=$(elem[i]).closest(obj.areaLevel0Selector).find(obj.inputTextSelector);
				
				// 防报错处理
				if($TextInput.length!==0){
					$TextInput[0].dataset.blzValuePre=elem[i].dataset.blzAmount=$TextInput.val();	
				}
				if(elem[i].checked){
					$(elem[i]).trigger('change');
				}
			}
		}
	}
	
	// 输入值检测
	function inputCheck(elem){
		var val=parseInt(elem.value);
		if(isNaN(val)){
			val=elem.dataset.blzMin;
		}
		if(val<elem.dataset.blzMin-0){
			val=elem.dataset.blzMin;
		}else if(val>elem.dataset.blzMax-0){
			val=elem.dataset.blzMax;
		}
		elem.value=val;
	}
	
	// 输入框与单选框保持同步
	function syncValue(elem,obj,total){
		var target=$(elem).closest(obj.areaLevel0Selector).find('[data-blz-checkout-level="0"]')[0],
			dValue=(elem.value-elem.dataset.blzValuePre)*target.dataset.blzPrice;
		target.dataset.blzAmount=elem.value;
		elem.dataset.blzValuePre=elem.value;
		if(target.checked){
			total=total+dValue;
			$(elem).trigger('theDifference',[total]);
		}
		return total;
	}
	
	// 数据的阶段性批量处理
	function processDataBatch(elem,timer,time,total,obj){
		clearTimeout(timer);
		return setTimeout(function(){
			$(elem).trigger('totalChange',[total]);
			isSelectedAll(elem,obj.areaSelector);
		},time);
	}
	
	// 指令层级发布
	function releaseInstruction(elemChief,level,obj){
		return $(elemChief).closest(obj.areaSelector).find('[data-blz-checkout-level="'+(level-1)+'"]');
	}
	
	$.fn.checkout=function(obj){
		
		// 参数初始化
		obj=obj||{};
		obj.onTotalChange=obj.onTotalChange||$.blz.emptyFunciton;
		obj.onTheDifference=obj.onTheDifference||$.blz.emptyFunciton;
		obj.onOverTotalMax=obj.onOverTotalMax||$.blz.emptyFunciton;
		obj.areaSelector=obj.areaSelector||'section';
		obj.buttonPlusSelector=obj.buttonPlusSelector||'[data-blz-checkout-button="plus"]';
		obj.buttonManusSelector=obj.buttonManusSelector||'[data-blz-checkout-button="manus"]';
		obj.inputTextSelector=obj.inputTextSelector||'.text';
		obj.areaLevel0Selector=obj.areaLevel0Selector||'li';
		obj.totalMax=obj.totalMax||Infinity;
		
		return this.each(function(){
			var total=0.00,
				timer=null;
			
			$(this).offCheckout(this).on('change.checkout','[data-blz-checkout-level]',function(){
				var level=this.dataset.blzCheckoutLevel;
				
				// 限额处理
				if(total>=obj.totalMax&&this.checked){
					this.checked=false;
					obj.onOverTotalMax(this);
				}else if(level-0===0){
					
					// 更新总额度
					total=getTotal(this.checked,this,total);

					// 连续触发时取消上次的操作，减少对Dom的操作
					timer=processDataBatch(this,timer,80,total,obj);
				}else{
					
					// 指令从上到下层级发布
					selectAll(releaseInstruction(this,level,obj),this.checked);
				}
			}).on('totalChange',function(e,data){
				
				// 总额度改变时的回调
				obj.onTotalChange(e,data);
				
			}).on('click.checkout',obj.buttonPlusSelector,function(){
				
				// 加号功能
				plusManusFn(this,1);
				
			}).on('click.checkout',obj.buttonManusSelector,function(){
				
				// 减号功能
				plusManusFn(this,-1);
				
			}).on('change.checkout',obj.inputTextSelector,function(){
				
				// 输入值合法性检测
				inputCheck(this);
				
				// 同步选中商品数量并更新选中总额
				total=syncValue(this,obj,total);
				
			}).on('theDifference',function(e,data){
				
				// 加减号引起总额度改变的回调
				obj.onTheDifference(e,data);
				
			});
			
			// 浏览器后退处理
			totalCorrect(this,obj);
		});
	};
	
	// 关闭结算功能
	$.fn.offCheckout=function(){
		return this.off('change.checkout click.checkout totalChange theDifference');
	};
	
	// 卸载组件
	$.offCheckout=function(selector){
		$(selector?selector:'form').offCheckout();
		$.blz.offCheckout=$.fn.checkout=$.fn.offCheckout=null;
	};
	
	return $;
});