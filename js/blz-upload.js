/*
 * 表单图片上传
 */
;(function(fn){
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
	  define(['jQuery','blz','blz-dialog','canvas-resize'],function () {
		return fn(window.jQuery,window.canvasResize);
	  });
	} else if (typeof module !== 'undefined' && module.exports) {
	  module.exports = fn(window.jQuery);
	}else{
		fn(window.jQuery);
	}
	/* jshint ignore:end */
})(function($,canvasResize){
    'use strict';
    
    var config={
		allowTypes:['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
		maxSize:10 * 1024 * 1024,
		maxCount:10,
		cache:[],
		onImageLoad:$.blz.emptyFunciton,
		width:300,
		quality:100
	};
	
	$.fn.blzUpload=function(obj){
		obj=$.extend(config,obj);
		
		return this.on('change.blzUpload','input[type="file"]',function () {
			$.weui.loading('数据处理中');
			var files = this.files,
				i=0,
				len=files.length;

			// 如果没有选中文件，直接返回
			if (len===0) {
				return;
			}
			for (;i<len;i++) {
				var file = files[i];

				// 如果类型不在允许的类型范围内
				if (obj.allowTypes.indexOf(file.type) === -1) {
					$.weui.alert({article:'该类型不允许上传'});
					continue;
				}

				if (file.size > obj.maxSize) {
					$.weui.alert({article:'图片太大，不允许上传'});
					continue;
				}

				if (i>obj.maxCount) {
					$.weui.alert({article:'最多只能上传' + obj.maxCount + '张图片'});
					i=len;
					$.weui.loading().hide();
				}else{
					canvasResize(file, {
						crop: false,
						quality: 100,
						width:obj.width,
						//rotate: 0,
						callback: function(data,w,h) {
							
							// 生成图片后
							config.onImageLoad(data,w,h);
							
							if(i>=len-1){
								$.weui.loading().hide();
							}
						}
					});
				}
			}
		});	
	};
}); 