/*
 * 表单验证插件
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd){
	  define(['jQuery','blz','blz-dialog','blz-scrollto','checkcard'],function (empty,$,$1,$2,IDValidator){
		  return fn($,IDValidator);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(window.jQuery,IDValidator);
	}
	/* jshint ignore:end */
}(function($,IDValidator){
	'use strict';
    
    // 提示语
    var checkTip={
        any:'内容不能为空',
        name:'姓名格式错误',
        id:'身份证号码格式错误',
        phone:'手机号码格式错误',
        phone:'手机号码格式错误',
        email:'邮箱格式错误',
        check:'验证码错误',
        agreement:'请同意协议',
        custom:'内容有误',
        price:'请输入消费金额',
        repeat:'密码输入不一致',
        childid:'孩子身份证号码格式错误',
        address:'省市区不能为空',
		bankcard:'银行卡号需为6-30位数字'
    };
    
    // 检验规则
	var checkRule={
		any:[[1,100]],
		anyname:[[1,30]],
		name:[[2,15],'[\u4e00-\u9fa5]{1,}(·?)[\u4e00-\u9fa5]{1,}$'],
		id:[[15,18],false,function(val){
			var Validator = new IDValidator();
			return Validator.isValid(val)&&getAge({
                    year:val.slice(6,10),
                    month:val.slice(10,12),
                    date:val.slice(12,14)
                })>0;
		}],
		phone:[[11,11],'^1'],
		email:[[4,30],'^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'],
		check:[[6,6],false,function(val){
			return val===($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val);
		}],
		agreement:[false,false,function(){
			return $(this).prop('checked');
		}],
		custom:[false,false,function(val){
			return val!==($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val+'1');
		}],
        price:[false,false,function(){
            return $(this).data('blz-value')>0;
        }],
        repeat:[false,false,function(val){
            return val===$($(this).attr('data-blz-same')).val();
        }],
        childid:[[18,18],false,function(val){
			var Validator = new IDValidator();
            var obj={
                    year:val.slice(6,10),
                    month:val.slice(10,12),
                    date:val.slice(12,14)
                };
			return Validator.isValid(val)&&getAge(obj)>0&&obj.year>=2010;
		}],
        address:[false,false,function(){
            return this.selectedIndex!==0;
        }],
		lengthcustom:[[6,6]],
		bankcard:[false,false,function(val){
			return val.replace(/ /g,'').length>=6&&val.replace(/ /g,'').length<=30;
		}],
		select:[false,false,function(val){
			return val>0;
		}]
	};
	var config={
		warnElemClass:'.weui_cell',
		warnClass:'.weui_cell_warn',
		agreementClass:'#glb-form-agreement',
		verificationCodeClass:'#glb-form-send input',
		checkElemClass:'[data-blz-type]:not([disabled])',
		getVerificationCode:$.blz.emptyFunciton,
		canSubmit:$.blz.emptyFunciton
	};
	
	// 获取年龄函数
	function getAge(obj){
        var age=0,
            now=new Date(),
            year=now.getFullYear(),
            month=now.getMonth()+1,
            date=now.getDate();
		var config={
			year:year,
			month:month,
			date:date
		};
        obj=$.extend(config,obj||{});
        age=year-obj.year;
        if(age<0){return age;}
        if(obj.month>month){
            age=age-1;
        }else if(obj.month===month){
            if(obj.date>date){
                age=age-1;
            }else{
                age=age+1;
            }
        }else {
            age=age+1;
        }
        return age;
    }
    
 	// 自动验证
	function loop($elem,warnElemClass,warnClass,callback){
		$elem.data('blzTimer',setTimeout(function(){
			callback.call($elem,false,warnElemClass,warnClass);
			loop($elem,warnElemClass,warnClass,callback);
		},800));
	}
    
	// 验证输入值的合法性
	function isCorrect(rules,type,elem,event){
		var tipLength=false,
			regular=false,
            customs=false,
			val=elem.value;
		if(rules[type][0]){
            tipLength = val.length < checkRule[type][0][0] || val.length > checkRule[type][0][1];
        }
        if(rules[type][1]){
            regular= new RegExp( rules[type][1], 'g');
            regular=!regular.test($.trim(val));
        }
        if(rules[type][2]&&(type!=='check'?true:event?true:false)){
            customs=!rules[type][2].call(elem,$.trim(val));
        }
		
		return tipLength||regular||customs;
	}
	
	// 对验证结果的处理
	function handleResult(tip,$this,option,event){
		var warnElemClass=option.warnElemClass,
			$elem=$this.closest(warnElemClass);
		
		if (tip){ 
            $elem.addClass(warnClass.slice(1));
            
            // 对于非法输入开启自动验证
            if($this.attr('data-blz-auto-check')!=='yes'){
                $this.attr('data-blz-auto-check','yes');
				loop($this,warnElemClass,warnClass,check);
            }
            if(event&&event.type==='submit'){
                if(val.length>0){
					$.weui.tip($this.attr('data-blz-alert')||checkTip[type]);
				}else {
					$.weui.tip($this.attr('placeholder')||checkTip[type]);
				}
            }
			
            $this.attr('data-blz-check','inpass').trigger('blzCheckInpass');
        } else { 
            
            // 输入合法验证
            $elem.removeClass(warnClass.slice(1));
            $this.attr('data-blz-check','pass');
			$this.attr('data-blz-auto-check','no');
			clearInterval($this.data('blzTimer'));
        }
	}
	
	// 计数器函数
	function count(n,$target){
		if(n>=0){
			$target.data('isCountStart',true).addClass('grey').html(n+' 秒<br>后重发');
			setTimeout(function(){
				count(--n,$target);
			},1000);
		}else {
			$target.removeClass('grey').html('获取<br>验证码').data('isCountStart',false);
		}
	}
    
    // 检验函数
	$.fn.blzCheck=function(obj){
		
		obj=$.extend(config,obj||{});
		this.data('blz-check',obj);
		
		return this.each(function(){
			var $this=$(this).blzCheckOff(),
				$elems=$this.find(obj.checkElemClass),
				$submit=$this.find('[type="submit"]');
			
			// 发送验证码
			$this.find(obj.verificationCodeClass).on('click.blzCheckVerificationCode',function(){
				var $this=$(this),
				    $target=$($this.attr('data-blz-target'));
				if($this.data('isCountStart')){
					
				}else{
					if($target.val().length===11&&$target.val()[0]==='1'){
						obj.getVerificationCode($target,$this);
						count(60,$this);
					}else{
							
					}
				}
			});

			// 协议交互
			$this.find($this.data('agreementClass')).on('change.agreement',function(){
				if(this.checked){
					$submit.prop('disabled',false);
				}else {
					$submit.prop('disabled',true);
				}
			});

			// 失去焦点时验证
			$elems.on('blur.check blurSimulation',function(e){
				check.call(e.target,event,$this.data('warnElemClass'),$this.data('warnClass'));
			}).on('focus.check',function(){
				this.select();
			});

			$this.on('submit.check',function(event){
				var i=0,
					displacement=0;
				$submit.prop('disabled',true);
				for(i=0;i<$elems.length;i++){
					check.call($elems[i],event,$this.data('warnElemClass'),$this.data('warnClass'));
					if($elems.eq(i).attr('data-blz-check')!=='pass'){
						displacement=$elems[i].getBoundingClientRect().top-window.innerHeight/2;
						setTimeout(function(){
							$(document.body).scrollTo(displacement,Math.abs(displacement*1.5),function(){});
						},300);
						$submit.prop('disabled',false);
						event.preventDefault();
						return;
					}
				}
				obj.canSubmit.call(this,event);
			});
		});
	};
    
	//安卓bug修复
	if (/Android/gi.test(navigator.userAgent)) {
        $(window).on('resize.check', function () {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 30);
            }
        });
    }

	// 关闭表单验证
	$.fn.blzCheckOff=function(){
		return this.each(function(){
			var $this=$(this);
			$this.find($this.data('verificationCodeClass')).off('click.verificationCode');
			$this.find($this.data('agreementClass')).off('change.agreement');
			$this.find($this.data('checkElemClass')).off('blur.check blurSimulation focus.check');
			$this.off('submit.check');
		});
	};
	
	// 表单验证组件卸载
	$.blzCheckOff=function(selector){
		$(selector?selector:'form').checkOff();
		$.fn.checkOff=null;
		$.fn.check=null;
		$(window).off('resize.check');
		$.checkOff=null;
	};
	
	return $;
}));