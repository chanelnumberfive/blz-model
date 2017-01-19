
/*
 * weui弹窗封装
 */
+function($){
	'use strict';
	
    if(!window.jQuery){
        throw new Error('blz-js plug-in need a jQuery,the version better over 3.1.0');
    }
    $.weui={};
	var modelAlert,modelConfirm,loading;
	$.weui.alert=function(obj){
		obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
		if(modelAlert){
			$(modelAlert).find('.weui_dialog_title').text(obj.title);
			$(modelAlert).find('.weui_dialog_bd').text(obj.article);
			$(modelAlert).fadeIn(300);
		}else{
			modelAlert='<div class="weui_dialog_alert" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
                            '<div class="weui_mask"></div>'+
                            '<div class="weui_dialog">'+
                                '<div class="weui_dialog_hd">'+
                                    '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                                '</div>'+
                                '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                                '<div class="weui_dialog_ft">'+
                                    '<a href="javascript:;" class="weui_btn_dialog primary" data-blz-dismiss=".weui_dialog_alert">确定</a>'+
                                '</div>'+
                            '</div>'+
                       '</div>';
			modelAlert=$(modelAlert).appendTo(document.body);
		}
	};
    
	$.weui.confirm=function(obj){
		obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
		if(modelConfirm){
			$(modelConfirm).find('.weui_dialog_title').text(obj.title);
			$(modelConfirm).find('.weui_dialog_bd').text(obj.article);
			$(modelConfirm).fadeIn(300);
		}else{
			modelConfirm='<div class="weui_dialog_confirm" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
                            '<div class="weui_mask"></div>'+
                            '<div class="weui_dialog">'+
                                '<div class="weui_dialog_hd">'+
                                    '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                                '</div>'+
                                '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                                '<div class="weui_dialog_ft">'+
                                    '<a href="javascript:;" class="weui_btn_dialog default" data-blz-dismiss=".weui_dialog_confirm" data-blz-option="cancell">取消</a>'+
                                    '<a href="javascript:;" class="weui_btn_dialog primary" data-blz-dismiss=".weui_dialog_confirm" data-blz-option="sure">确定</a>'+
                                '</div>'+
                            '</div>'+
                         '</div>';
			modelConfirm=$(modelConfirm).appendTo(document.body);
		}
        
        
		if(obj.cancellCallback){
			$(document).one('tapBlzOptioncancell',function(e){
				obj.cancellCallback(e);
				$(document).off('tapBlzOptionsure');
			});
		}
		if(obj.sureCallback){
			$(document).one('tapBlzOptionsure',function(e){
				obj.sureCallback(e);
				$(document).off('tapBlzOptioncancell');
			});
		}
        
		// 确定取消按钮
		$(document).one('click','[data-blz-option]',function(){
			var data=$(this).data('blz-option');
			setTimeout(function(){
				$(document).trigger('tapBlzOption'+data);
			},0);
		});
	};
    
    $.weui.loading=function(){
        if(loading){
            $(loading).css('display','block');
        }else{
            loading='<div id="loadingToast" class="weui_loading_toast" style="display: none;">'+
                            '<div class="weui_mask_transparent"></div>'+
                            '<div class="weui_toast">'+
                                '<div class="weui_loading">'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
                                '</div>'+
                                '<p class="weui_toast_content">数据加载中</p>'+
                            '</div>'+
                        '</div>';
             loading=$(loading).appendTo(document.body).css('display','block');
        }
        return loading;
    };
	
    // dismiss交互
	$(document).on('click','[data-blz-dismiss]',function(){
		var target=$(this).data('blz-dismiss');
		$(target).fadeOut(330);
	});
}(window.jQuery);

/*
 * blz模块声明
 */
+function($){
    'use strict';
    $.blz={};
    $.blz.emptyFunciton=function(){};
    $.blz.getDataType=function(data){
        return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
    };
    $.blz.useragent=/Android/gi.test(navigator.userAgent);
}(window.jQuery);


/*
 * 启动页动画
 */
+function($){
  'use strict';
  if(!window.Swiper){return false;}
  
  var index=document.querySelectorAll('.swiper-slide').length-1;
  var pointer=document.querySelector('.glb-pointer');  
  
  if(window.innerWidth/window.innerHeight>0.64){
      $('.swiper-slide').css('height',1.625*window.innerWidth);
      $(pointer).css('display','none');
      return false;
  }
  // swiper
  Swiper.prototype.plugins.debugger = function (swiper, params) {
    if (!params) {return;}
    
    // Need to return object with properties that names are the same as callbacks
    return {
        onSlideChangeStart: function (swiper) {
            if(swiper.activeIndex===index){
                pointer.className+=' no-animation';
            }else{
                pointer.className=pointer.className.replace(/no-animation/g,'');
                
            }
        }
    };
  };
        
 var swiper = new Swiper('#swiper', {
          direction: 'vertical',
          slidesPerView: 1,
          mousewheelControl: true,
          //freeMode: h>=500?false:true,
          debugger:true
      }); 
}(window.jQuery);
 
/*
 * 表单验证小孩年龄
 */
+function($){
    'use strict';
    
    $.serverTime=$.serverTime||{};
    $.blz.getAge=function(obj){
        var age=0;
        var now=new Date();
        var year=$.serverTime.year||now.getFullYear();
        var month=$.serverTime.month||now.getMonth()+1;
        var date=$.serverTime.date||now.getDate();
        obj=obj||{};
        obj.year=parseInt(obj.year)||year;
        obj.month=parseInt(obj.month)||month;
        obj.date=parseInt(obj.date)||date;
        age=year-obj.year;
        if(obj.month>month){
            age=age-1<0?0:age-1;
        }else if(obj.month===month){
            if(obj.date>date){
                age=age-1<0?0:age-1;
            }else{
                age=age;
            }
        }else {
            age=age;
        }
        return age;
    };    
}(window.jQuery);


/*
 * 表单图片上传
 */
+function($){
    'use strict';
    
    var progress=document.querySelector('.glb-form-progress');
    
    // 允许上传的图片类型
    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    
    // 图片上传大小限制10MB
    var maxSize = 10 * 1024 * 1024;
    
    // 最大上传图片数量
    var maxCount = 1;
    
    // 处理后图片的缓存
    var images = [];
    
    // 加载窗口
    var loading=$('数据加载中');
    
    $('.glb-form-input-file').on('change', function (event) {
        var files = event.target.files;

        // 如果没有选中文件，直接返回
        if (files.length === 0) {
            return;
        }
        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];

            // 如果类型不在允许的类型范围内
            if (allowTypes.indexOf(file.type) === -1) {
                $.weui.alert({article:'该类型不允许上传'});
                continue;
            }

            if (file.size > maxSize) {
                $.weui.alert({article:'图片太大，不允许上传'});
                continue;
            }

            if ($('.weui_uploader_file').length >= maxCount) {
                $.weui.alert({article:'最多只能上传' + maxCount + '张图片'});
                return;
            }
            loading=$.weui.loading();    
            canvasResize(file, {
                crop: false,
                quality: 100,
                //rotate: 0,
                callback: function(data,w,h) {
                    
                    // 插入到预览区
                    var $btnFile=$('.glb-form-btn-file.demo');
                    $(loading).css('display','none');
                    $btnFile.css('background-image','url('+data+')');
                    if(w>=h){
                        $btnFile.css('background-size','100% auto');
                    }else {
                        $btnFile.css('background-size','auto 100%');
                    }
                    
                    // 存储的修改后的图片备份发后台待处理.....................
                    images.push(data);
                      
                }
            });
            
            // 异步上传
            var xhr = new XMLHttpRequest();
            var data=new FormData();
            data.push();
            progress.className=progress.className.replace(/fade-out/g,'');
            
            xhr.upload.addEventListener("progress", function(e) {
                  if (e.lengthComputable) {
                    var percentage = Math.round((e.loaded * 100) / e.total);
                    progress.textContent=percentage + '%';
                    console.log(percentage);
                  }
                }, false);
            
            xhr.upload.addEventListener("load", function(){
                    progress.textContent=100 + '%';
                    setTimeout(function(){
                      progress.textContent='';
                    },300);
                }, false);
            xhr.open("POST", "http://192.168.1.157:8080",true);
            xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
            xhr.send(data);
        }
    });
}(window.jQuery); 

/*
 * 表单验证插件
 */
+function($){
	'use strict';
    
    // 检验规则
	var checkRule={
		any:[[2,100]],
		name:[[2,15],'[\u4e00-\u9fa5]{1,}(·?)[\u4e00-\u9fa5]{1,}$'],
		id:[[15,18],false,function(val){
			var Validator = new IDValidator();
			return Validator.isValid(val);
		}],
		phone:[[11,11],'^1'],
		email:[[4,30],'^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'],
		check:[[4,6],false,function(val){
			return val===($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val);
		}],
		agreement:[false,false,function(){
			return $(this).prop('checked');
		}],
		custom:[false,false,function(val){
			return val!==($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val+'1');
		}]
	};
    
    // 核心检验函数
	$.fn.check = function(obj) {
        obj=obj||{};
        obj.getVerificationCode=obj.getVerificationCode||$.blz.emptyFunciton;
        obj.canSubmit=obj.canSubmit||$.blz.emptyFunciton;
        
		if(this.length<=0){return false;}
		var $elems = this.find('[data-blz-type]'); // 获取要验证的表单元素
		var isCountStart=false;
    	var $Tel=$('input[type="tel"]');
		var tip=false;
		var isCheckSendClick=false;
		var isSubmit=false;
        
        // 检查表单值是否合法函数
		function check(event) {
			var val=$(this).val();
			var type=$(this).attr('data-blz-type');
			var rule = false;
			var $elem=$($(this).closest('.glb-form-cell'));
			if(event){tip = true;}
			var tipLength=false;
			var customs=false;
			if(checkRule[type][0]){
				tipLength = val.length < checkRule[type][0][0] || val.length > checkRule[type][0][1];
			}
			if(checkRule[type][1]){
				rule = new RegExp( checkRule[type][1], 'g');
				rule=!rule.test($.trim(val));
			}
			if(checkRule[type][2]){customs=!checkRule[type][2].call(this,$.trim(val));}
			if (rule||tipLength||customs) { // 输入非法验证
				$elem.addClass('warn')&& event&&event.preventDefault();
				tip=true;
				$(this).attr('data-blz-check','inpass');
				return false;
			} else { // 输入合法验证
				$elem.removeClass('warn');
				$(this).attr('data-blz-check','pass');
				for(var i=0,j=$elems.length-1;i<=j;i++){
					if($elems.eq(i).attr('data-blz-check')==='inpass'){
						if(event){event.preventDefault();}
						break;
					}	
				}
			}
		}
		
        // 计数器函数
		function count(n,$target){
			if(n>=0){
				isCountStart=true;
				$target.addClass('grey');
				$target.val(n+' 秒');
				setTimeout(function(){
					count(--n,$target);
				},1000);
			}else {
				$target.removeClass('grey');
				$target.val('获取验证码');
				isCountStart=false;
			}
		}
		$('#glb-form-send').off('click.sendMessage');
		$('#glb-form-send').on('click.sendMessage',function(){
            if(isCountStart){return false;}
			isCheckSendClick=true;
			if(!isSubmit){tip=false;}
			if($Tel.val().length===11&&$Tel.val()[0]==='1'){
				obj.getVerificationCode($('input[data-blz-type="check"]'));
			}else{
			    return false;	
			}
			count(45,$(this));
		});
        
        
		this.off('submit.blz');
		this.on('submit.blz',function(event){
			isSubmit=true;
			$elems.each(function(){check.call(this,event);});
            obj.canSubmit(event);
		});
        
		clearInterval($.blz.timer1);
		clearInterval($.blz.timer2);
		$.blz.timer1=setInterval(function(){
			if(!tip){return false;}
			$elems.each(function(){check.call(this);});
		},1000);
		$.blz.timer2=setInterval(function(){
			if(!isCheckSendClick||isSubmit){return false;}
			check.call($Tel[0]);
			if(!isSubmit){tip=false;}
		},1000);
		return this;
	};
	
	//安卓bug修复
	if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        });
    }
}(window.jQuery);


/*
 * 表单响应go按键主动提交
 */
 +function($){
    'use strict';
    
    $(document).on('keyup',function(e){
        if(e.which===13){
            $('form').submit();
        }
    }); 
 }(window.jQuery);
 
/*
 * 条款交互
 */
+function($){
	'use strict';
    
    if(document.querySelector('[data-blz-pdf]')===null){return false;}
    
	// 预加载
	$.blz.cache=[];
	var $pdf=$('a[data-blz-pdf]');
	for(var i=0; i<$pdf.length;i++){
		var datas=$pdf.eq(i).data('blz-pdf');
		var data=datas.split(' ');
		var length=data.length;
		for(var j=0;i<length;i++){
			var img=new Image();
			img.src=data[j];
			$.blz.cache[$.blz.cache.length]=img;
		}
	}
	$(document).on('click','[data-blz-pdf]',function(event){
		event.preventDefault();
        var loading=$.weui.loading();
		var datas=$(this).data('blz-pdf');
		var data=datas.split(' ');
		var length=data.length;
		var a=[];
        $('#wrapper').html('<ul><li id="img-box"></li></ul>');
		for(var i=0;i<length;i++){
			var img=new Image();
			img.onload=function(){
				a[a.length]=this;
				length--;
				if(length<=0){
					for(var i=0; i<a.length;i++){
						$(a[i]).appendTo($('#img-box'));
					}
                    $(loading).css('display','none');
					$('#glb_weui_mask').show();
					var myScroll = new IScroll('#wrapper', {
						scrollbars: true,
						mouseWheel: true,
						interactiveScrollbars: true,
						shrinkScrollbars: 'scale',
						fadeScrollbars: true
					});
				}
			};
			img.src=data[i];
			
		}
	});
	$('#glb_weui_mask').on('click',function(){
		$(this).hide();
	});
}(window.jQuery||window.Zepto);



/*
 * 键盘
 */
+function($){
    'use strict';
    
    if($('.glb-keyboard').length<=0){return false;}
    
    var $keyboard=$('.glb-keyboard');
    var $sync={
        length:0,
        elems:null,
        selector:''};
    var $targetInput=$('哈哈');
    var $targetTwinkle=$('哈哈');
    var $targetElem=$('哈哈');
    var $Inputs=$('[data-blz-keyboard="true"][data-blz-input="true"]').find('input');
    
    //获取window高度
    var h1=window.innerHeight;
    var h2=h1;
    
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
    function toMyValue(val,$target){
        if($target.data('blz-max')){
            val=val<=$target.data('blz-max')?val:$target.data('blz-max').toString();
        }
        if($target.data('blz-min')){
            val=val>=$target.data('blz-min')?val:$target.data('blz-min').toString();
        }
        if($target.data('blz-tofixed')&&val.indexOf('.')!==-1&&val.length-val.indexOf('.')>$target.data('blz-tofixed')){
            val=parseFloat(val).toFixed($target.data('blz-tofixed')-0);
        }
        return val;
    }
    
    // 模拟键盘输入
    function input($elem,$target){
        var val=$target.val();
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
        }else if($elem.is('.glb-keyb-confirm')&&$elem.closest('.glb-keyboard').is('glb-submit-available')){
            $target.closest('form').trigger('submit');
            return false;
        }else {
            return false;
        }
        val=toMyValue(val,$target);
        $target.val(val);
        val1=lookBetter(val);
        if($sync.length!==0&&$sync.selector===$target.data('blz-sync')){
            $sync.elems.each(function(index, element) {
                if('value' in element){
                    element.value=toMyValue(val,$(element));
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
        canSubmit($elem);
        setTimeout(function(){
            $target.trigger('blzkeyup');
        },0);
    }
    
    // 数据互联，互动
    $(document).on('blzChangeBindData',function(e){
        var $target=$($(e.target).data('blz-sync'));
        var val=e.target.value;
        var val1=lookBetter(val);
        $target.each(function(index, element) {
            if('value' in element){
                element.value=toMyValue(val,$(element));
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
        }else if($targetElem.length===0||$targetElem.is('[data-blz-keyboard="false"]')){
            $targetTwinkle.removeClass('glb-show').addClass('glb-hide');
            $keyboard.addClass('glb-slide-below').removeClass('glb-slide-up').off('click');
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
                },0);
            }
        });   
    }
}(window.Zepto||window.jQuery);

/*
 * 页面交互bug修复
 * 自动启用表单验证
 */
document.body.addEventListener('touchstart',function(){},false);
$('form').check();