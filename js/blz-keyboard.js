/*
 * 键盘
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['blz','blz-cartoon','blz-scrollto'],function ($,$1) {
		return fn($,$.blz.checkTransition());
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(window.jQuery,window.jQuery.blz.checkBrowerKernel());
	}
	/* jshint ignore:end */
})(function($,hack){
    'use strict';
    
    // 获取window高度
    var h1=window.innerHeight,
        h2=h1;

    var html='<table id="model-keyboard" class="model-keyboard model-submit-available slide-in" cellspacing="0" data-blz-cartoon="#model-keyboard on">'+
                '<caption><span class="glb-for-screen">虚拟键盘</span></caption>'+
                '<tbody>'+
                    '<tr>'+
                        '<td role="button">1</td>'+
                        '<td>2</td>'+
                        '<td>3</td>'+
                        '<td class="model-keyb-delete"></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td>4</td>'+
                        '<td>5</td>'+
                        '<td>6</td>'+
                        '<td rowspan="3" class="model-keyb-confirm">确认</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td>7</td>'+
                        '<td>8</td>'+
                        '<td>9</td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td class="model-keyb-hide" data-blz-cartoon="#model-keyboard off"></td>'+
                        '<td>0</td>'+
                        '<td>.</td>'+
                    '</tr>'+
               '</tbody>'+
            '</table>';

    var constant={
        name:'blzKeyboard',
        version:'20170307',
        dataMax:'blz-max',
        dataMin:'blz-min',
        dataTofixed:'blz-tofixed',
        datasetValue:'blzValue',
        eventNameChange:'change',
        keyboardSelector:'#model-keyboard',
        deleteSelector:'.model-keyb-delete'
    };

    var keyboardConfig={
        keyboardAreaSelector:'#model-keyboard-area',
        inputSelector:'.mf-input',
        cartoon:true,
        sureText:'确认',
        onFocus:$.blz.emptyFn,
        onBlur:$.blz.emptyFn,
        constant:constant
    };

    // 键盘构造函数    
    function Keyboard(obj){
        return $.extend(true,this,keyboardConfig,obj);
    }    

    // 输入金额美化
    Keyboard.prototype.lookBetter=function(val){
        if(!val||val===''){return '';}
        val=val.toString();
        var betterVal='',
            a=[],
            index=val.indexOf('.'),
            l=parseInt(val).toString().length;

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
    
    // 自身输入值监测
    Keyboard.prototype.toMyValue=function(val,$target,constant){
        var index=-1,
            toFixed=$target.data(constant.dataTofixed);
        if($target.data(constant.dataMax)){
            val=val<=$target.data(constant.dataMax)?val:$target.data(constant.dataMax);
        }
        if($target.data(constant.dataMin)){
            val=val>=$target.data(constant.dataMin)?val:$target.data(constant.dataMin);
        }
        val=val+'';
        if((toFixed||toFixed===0)&&val.indexOf('.')!==-1&&val.length-1-val.indexOf('.')>toFixed){
            index=val.indexOf('.');
            if(toFixed!==0){
                val=val.slice(0,index+toFixed+1);
            }else{
                val=val.slice(0,index);
            }
        }
        
        return val;
    }
    
    // 模拟键盘输入
    Keyboard.prototype.input=function(elem,target,data,constant){
        var val=target.dataset[constant.datasetValue]?target.dataset[constant.datasetValue]:'',
            text=$.trim(elem.textContent),
            type=target.dataset.blzValidateType,
            $target=$(target);

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
        }else if($(elem).is(constant.deleteSelector)){
            val=val.slice(0,-1);
        }else {
            return;
        }

        val= this.toMyValue(val,$(target),constant);
		if(type==='price'){
            target.value=this.lookBetter(val);
        }else{
            target.value=val;
        }
        $target.trigger(constant.eventNameChange);
        target.dataset[constant.datasetValue]=val;
    };
    
    // 交互优化（让不在视野内的元素进入视野）
    Keyboard.prototype.scrollIntoView=function(elemArea,elemKeyboard,elemTarget){
        var bottom=elemArea.getBoundingClientRect().bottom,
            h=elemKeyboard.offsetHeight,
            x=0,
            $elem=null;
        if(bottom+h>h1){
            $elem=$(elemArea);
            $elem.css({
                height:h1-h,
                'transition':'height .3s linear',
                'overflow-y':'scroll',
                '-webkit-overflow-scrolling':'touch'
            });
            bottom=elemTarget.getBoundingClientRect().bottom;
            x=h1-h-bottom;
            if(x<0){
                $(elemArea).blzScrollto({
                    displacement:-x,
                    time:300
                });
            }
        }    
    };

    // 开启键盘
    $.fn.blzKeyboard=function(obj){
        var data=new Keyboard(obj),
            constant=data.constant,
            $this=$(this).blzKeyboardOver(data).data(constant.name,data),
            $keyboard=$(html.replace('确认',data.sureText)).appendTo(document.body),
            $keyboardArea=$(data.keyboardAreaSelector);
        return this.each(function(){
            
            // 安卓处理
            if($.blz.isAndroid){
                $keyboard.on(data.eventNameOn,function(){
                    $keyboard.removeClass(data.eventNameOn);  
                });
                $(window).on('resize.'+constant.name,function(){
                    h2=window.innerHeight;
                    if(h2>=h1){
                        setTimeout(function(){
                            $($keyboard.data(data.switcher)[0]).trigger('click');
                        },80);
                    }
                });
            }

            if(data.cartoon){
                $(document).blzCartoon(data.cartoonConfig);
            }       
            $keyboard.on('click.'+constant.name,'td',function(){
                var target=$keyboard.data('blz-cartoon-switcher')[0];
                if(target.tagName.tolowerCase!=='input'){
                    target=$(target).find(data.inputSelector)[0];
                }
                target.focus();
                data.input(this,target,data,constant); 
            }).on('animation',function(){
                var target=$keyboard.data('blz-cartoon-switcher')[0];

                data.scrollIntoView($keyboardArea[0],$keyboard[0],target);
            }).on('offAnimation',function(){
                $keyboardArea.css('height','auto');
            });
        });      
    };

    // 关闭键盘
    $.fn.blzKeyboardOver=function(data){
        data=data||this.data('blzKeyboard')||keyboardConfig;
        var $keyboard=$(data.constant.keyboardSelector),
            name=data.constant.name;
        $keyboard.off('animation offAnimation click.'+name).remove();
        $(window).off('resize.'+name);
        return $(document).blzCartoonOff().removeData(name);
    };
   
	return $;
});