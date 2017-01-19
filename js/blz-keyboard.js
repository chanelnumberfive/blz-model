/*
 * 键盘
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery','blz'],function (empty,$) {
		return fn($,$.blz.checkBrowerKernel());
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(widnow.jQuery,window.jQuery.blz.checkBrowerKernel());
	}
	/* jshint ignore:end */
})(function($,hack){
    'use strict';
    
    var $keyboard=$('.glb-keyboard');
    var $sync={
        length:0,
        elems:null,
        selector:''};
    var $targetInput=$();
    var $targetTwinkle=$();
    var $targetElem=$();
    var $Inputs=$('[data-blz-keyboard="true"][data-blz-input="true"]').find('input');
    var $targetInputPrev=$targetInput;
	var $form=$('.model-form');
    
    // 获取window高度
    var h1=window.innerHeight;
    var h2=h1;
	var h3=$keyboard.height();
    
    // 差值
    var dy=0;
    
    // 是否可以提交
    function canSubmit($elem){
        var a=false;
        for(var i=0;i<$Inputs.length;i++){
            if($Inputs.eq(i).val()<=0){
                a=false;
                break;
            }else {
                a=true;
            }
        }
        if(a){
            $elem.closest('.glb-keyboard').addClass('glb-submit-available');
        }else {
            $elem.closest('.glb-keyboard').removeClass('glb-submit-available');
        }
    }
    
    //金额美化函数
    function lookBetter(val){
        if(val===''){return '';}
        val=val.toString();
        var betterVal='';
        var a=[];
        var index=val.indexOf('.');
        var l=parseInt(val).toString().length;
        for(var i=l;i>=3;i-=3){
            a[a.length]=val.slice(i-3,i);
        }
        if(l%3!==0){
            a[a.length]=val.slice(0,l%3);
        }
        for(i=a.length-1;i>0;i--){
            betterVal+=a[i]+',';
        }
        betterVal+=a[0];
        if(index!==-1){
            betterVal+=val.slice(index,val.length);
        }
        return betterVal;
    }
    
    // input值键入时自身属性检测
    function toMyValue(val,$target,tip){
        var index=-1;
        if($target.data('blz-max')){
            val=val<=$target.data('blz-max')?val:$target.data('blz-max').toString();
        }
        if($target.data('blz-min')){
            val=val>=$target.data('blz-min')?val:$target.data('blz-min').toString();
        }
        if($target.data('blz-sync-map')&&tip){
            val=val*$target.data('blz-sync-map');
            val=''+val;
        }
        if($target.data('blz-tofixed')&&val.indexOf('.')!==-1&&val.length-val.indexOf('.')>$target.data('blz-tofixed')){
            index=val.indexOf('.');
            val=val.slice(0,index+3);
        }
        
        return val;
    }
    
    // 模拟键盘输入
    function input($elem,$target){
        var val=$target.data('blz-value')?$target.data('blz-value').toString():'';
        var text=$elem.text();
        var val1='';
        if(!isNaN(parseInt(text))){
            if(val.length===1&&val==='0'){
                val=text;
            }else{
                val=val+text;
            }
            
        }else if(text==='.'){
            if(val.indexOf('.')===-1&&val.length>0){
                val=val+'.';
            }
        }else if($elem.is('.glb-keyb-delete')){
            val=val.slice(0,-1);
        }else if($elem.is('.glb-keyb-confirm')&&$elem.closest('.glb-keyboard').is('.glb-submit-available')){
            $('.model-form').trigger('submit');
            return;
        }else {
            return false;
        }
        val=toMyValue(val,$target,false);
        val1=lookBetter(val);
		$target.val(val1);
		$target.data('blz-value',val);
        if($sync.length!==0&&$sync.selector===$target.data('blz-sync')){
            $sync.elems.each(function(index, element) {
                if('value' in element){
                    element.value=toMyValue(val,$(element),true);
                    if($(element).data('blz-sync')){
                        setTimeout(function(){
                            $(element).trigger('blzChangeBindData');
                        },0);
                    }
                }else{
                    element.textContent=val1;
                }
            });
        }
        
        // canSubmit($elem);
        setTimeout(function(){
            $target.trigger('blzkeyup');
        },0);
    }
    
    // 被动触发数据互联，互动
    $(document).on('blzChangeBindData',function(e){
        var $target=$($(e.target).data('blz-sync'));
        var val=e.target.value;
        var val1=lookBetter(val);
        $target.each(function(index, element) {
            if('value' in element){
                element.value=toMyValue(val,$(element),true);
            }else{
                element.textContent=val1;
            }
        });
    });
    
    // 当点击带有data-blz-keyboard的元素聚焦时弹出此键盘，并显示光标
    // 失去焦点时，隐藏键盘，光标
    $(document).on('click.blz.keyboard',function(event){
        
        $targetElem=$(event.target).closest('[data-blz-keyboard]');
        
        // 根据h2的高度来决定程序是否继续执行
        if(h2<h1){return false;}
        
        if($targetElem.is('[data-blz-keyboard="true"][data-blz-input="true"]')){
            $targetTwinkle.removeClass('glb-show').addClass('glb-hide');
            $targetInput=$targetElem.is('input')?$targetElem:$targetElem.find('input[readonly]');
            
			// 交互优化删除多余的0
			var val=parseFloat($targetInput.data('blz-value'));
			$targetInput.data('blz-value',val);
			$targetInput.val(lookBetter(isNaN(val)?'':val));
			setTimeout(function(){
				$targetInput.trigger('blzChangeBindData');
			},30);
			
            // blur focus事件模拟
            if($targetInputPrev[0]!==$targetInput[0]){
               setTimeout(function(){
                   $targetInputPrev.trigger('blurSimulation');
                   $targetInput.trigger('focusSimulation');
                   $targetInputPrev=$targetInput;
               },0);         
            }
            
            if($targetInput.data('blz-sync')){
                $sync.elems=$($targetInput.data('blz-sync'));
                $sync.length=$sync.elems.length;
                $sync.selector=$targetInput.data('blz-sync');
            }
            $targetTwinkle=$targetElem.closest('.weui_cell').find('.glb-twinkle').addClass('glb-show').removeClass('glb-hide');
            $keyboard.addClass('glb-slide-up').removeClass('glb-slide-below')
                     .off('click')
                     .on('click','td',function(){
                         input($(this),$targetInput); 
                     });
			
			// 判断input的位置，键盘激活后是否对其位置进行调整
           dy=$targetInput[0].getBoundingClientRect().bottom+60-window.innerHeight+h3;
           if(dy>0){
                $form.css(hack+'transform','translateY('+(-dy)+'px)');
           }
           
           // 增加等于键盘高度的padding值，
           $form.css('padding-bottom',h3);
			
        }else if($targetElem.length===0||$targetElem.is('[data-blz-keyboard="false"]')){
            $targetTwinkle.removeClass('glb-show').addClass('glb-hide');
            $keyboard.addClass('glb-slide-below').removeClass('glb-slide-up').off('click');
            setTimeout(function(){
                $targetInputPrev.trigger('blurSimulation');
                $targetInputPrev=$('空元素');
            },0);
			
			$form.css(hack+'transform','translateY(0px)');
            
            // 键盘消失时去除之前添加的padding值
            $form.css('padding-bottom',0);
        }
    });
    
    // resize ios下原生键盘弹出不会触发resize事件而安卓则会，此事件只针对安卓
    if($.blz.useragent){
        $(window).on('resize',function(){
            h2=window.innerHeight;
            $('#text').text(h2);
            if(h2>=h1){
                setTimeout(function(){
                    $targetElem.trigger('click.blz.keyboard');
                },30);
            }
        });   
    }
   
   // 呼起模拟键盘
   if(window.innerHeight>=480&&!document.getElementById('ol-form')){
        $Inputs.eq(0).trigger('click'); 
   }
	return $;
});