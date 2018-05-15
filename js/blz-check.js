/*
 * 表单验证插件
 */
;(function (fn) {
	'use strict';
	/* jshint ignore:start */
	if (typeof define === 'function' && define.amd) {
		define(['jquery', 'blz-dialog', 'blz-scrollto'], function ($) {
			return fn($);
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		require('./blz-dialog.js');
		require('./blz-scrollto.js');
		module.exports = fn(require('./jquery.js'));
	} else {
		fn(window.jQuery);
	}
	/* jshint ignore:end */
})(function ($) {
	'use strict';
	
	// id检验
	var IDValidator = function () {

		var param = {
			error: {
				longNumber: '长数字存在精度问题，请使用字符串传值！ Long number is not allowed, because the precision of the Number In JavaScript.'
			}
		};

		var util = {
			checkArg: function (id, forceType) {
				var argType = (typeof id);

				switch (argType) {
					case 'number':
						//long number not allowed
						id = id.toString();
						if (id.length > 15) {
							this.error(param.error.longNumber);
							return false;
						}
						break;
					case 'string':
						break;
					default:
						return false;
				}

				id = id.toUpperCase();

				if (forceType && !isNaN(forceType)) {
					forceType = parseInt(forceType);
					if (id.length !== forceType) {
						return false;
					}
				}

				var code = null;
				if (id.length === 18) {
					//18位
					code = {
						body: id.slice(0, 17),
						checkBit: id.slice(-1),
						type: 18
					};
				} else if (id.length === 15) {
					//15位
					code = {
						body: id,
						type: 15
					};
				} else {
					return false;
				}

				return code;
			},
			
			//地址码检查
			checkAddr: function (addr, GB2260) {
				var addrInfo = this.getAddrInfo(addr, GB2260);
				return (addrInfo === false ? false : true);
			},
			
			//取得地址码信息
			getAddrInfo: function (addr, GB2260) {
				GB2260 = GB2260 || null;
				//查询GB/T2260,没有引入GB2260时略过
				if (GB2260 === null) {
					return addr;
				}
				if (!GB2260.hasOwnProperty(addr)) {
					//考虑标准不全的情况，搜索不到时向上搜索
					var tmpAddr;
					tmpAddr = addr.slice(0, 4) + '00';
					if (!GB2260.hasOwnProperty(tmpAddr)) {
						tmpAddr = addr.slice(0, 2) + '0000';
						if (!GB2260.hasOwnProperty(tmpAddr)) {
							return false;
						} else {
							return GB2260[tmpAddr] + '未知地区';
						}
					} else {
						return GB2260[tmpAddr] + '未知地区';
					}
				} else {
					return GB2260[addr];
				}
			},
			
			//生日码检查
			checkBirth: function (birth) {
				var year, month, day;
				if (birth.length === 8) {
					year = parseInt(birth.slice(0, 4), 10);
					month = parseInt(birth.slice(4, 6), 10);
					day = parseInt(birth.slice(-2), 10);
				} else if (birth.length === 6) {
					year = parseInt('19' + birth.slice(0, 2), 10);
					month = parseInt(birth.slice(2, 4), 10);
					day = parseInt(birth.slice(-2), 10);
				} else {
					return false;
				}
				// TODO 是否需要判断年份
				/*
				if( year<1800 ){
					return false;
				}
				*/
				//TODO 按月份检测
				if (month > 12 || month === 0 || day > 31 || day === 0) {
					return false;
				}

				return true;
			},
			//顺序码检查
			checkOrder: function () {
				//暂无需检测

				return true;
			},
			//加权
			weight: function (t) {
				return Math.pow(2, t - 1) % 11;
			},
			//随机整数
			rand: function (max, min) {
				min = min || 1;
				return Math.round(Math.random() * (max - min)) + min;
			},
			//数字补位
			str_pad: function (str, len, chr, right) {
				str = str.toString();
				len = len || 2;
				chr = chr || '0';
				right = right || false;
				if (str.length >= len) {
					return str;
				} else {
					for (var i = 0, j = len - str.length; i < j; i++) {
						if (right) {
							str = str + chr;
						} else {
							str = chr + str;
						}
					}
					return str;
				}
			},
			//抛错
			error: function (msg) {
				var e = new Error();
				e.message = 'IDValidator: ' + msg;
				throw e;
			}
		};

		var _IDValidator = function (GB2260) {
			if (typeof GB2260 !== "undefined") {
				this.GB2260 = GB2260;
			}
			//建立cache
			this.cache = {};
		};

		_IDValidator.prototype = {

			isValid: function (id, forceType) {
				var GB2260 = this.GB2260 || null;
				var code = util.checkArg(id, forceType);
				if (code === false) {
					return false;
				}
				//查询cache
				if (this.cache.hasOwnProperty(id) && typeof this.cache[id].valid !== 'undefined') {
					return this.cache[id].valid;
				} else {
					if (!this.cache.hasOwnProperty(id)) {
						this.cache[id] = {};
					}
				}

				var addr = code.body.slice(0, 6);
				var birth = (code.type === 18 ? code.body.slice(6, 14) : code.body.slice(6, 12));
				var order = code.body.slice(-3);

				if (!(util.checkAddr(addr, GB2260) && util.checkBirth(birth) && util.checkOrder(order))) {
					this.cache[id].valid = false;
					return false;
				}

				//15位不含校验码，到此已结束
				if (code.type === 15) {
					this.cache[id].valid = true;
					return true;
				}

				/* 校验位部分 */

				//位置加权
				var posWeight = [];
				for (var i = 18; i > 1; i--) {
					var wei = util.weight(i);
					posWeight[i] = wei;
				}

				//累加body部分与位置加权的积
				var bodySum = 0;
				var bodyArr = code.body.split('');
				for (var j = 0; j < bodyArr.length; j++) {
					bodySum += (parseInt(bodyArr[j], 10) * posWeight[18 - j]);
				}

				//得出校验码
				var checkBit = 12 - (bodySum % 11);
				if (checkBit === 10) {
					checkBit = 'X';
				} else if (checkBit > 10) {
					checkBit = checkBit % 11;
				}
				checkBit = (typeof checkBit === 'number' ? checkBit.toString() : checkBit);

				//检查校验码
				if (checkBit !== code.checkBit) {
					this.cache[id].valid = false;
					return false;
				} else {
					this.cache[id].valid = true;
					return true;
				}

			},

			//分析详细信息
			getInfo: function (id, forceType) {
				var GB2260 = this.GB2260 || null;
				//号码必须有效
				if (this.isValid(id, forceType) === false) {
					return false;
				}
				var code = util.checkArg(id);

				//查询cache
				//到此时通过isValid已经有了cache记录
				if (typeof this.cache[id].info !== 'undefined') {
					return this.cache[id].info;
				}

				var addr = code.body.slice(0, 6);
				var birth = (code.type === 18 ? code.body.slice(6, 14) : code.body.slice(6, 12));
				var order = code.body.slice(-3);

				var info = {};
				info.addrCode = addr;
				if (GB2260 !== null) {
					info.addr = util.getAddrInfo(addr, GB2260);
				}
				info.birth = (code.type === 18 ? (
						([birth.slice(0, 4), birth.slice(4, 6), birth.slice(-2)]).join('-')) :
					(['19' + birth.slice(0, 2), birth.slice(2, 4), birth.slice(-2)]).join('-')
				);
				info.sex = (order % 2 === 0 ? 0 : 1);
				info.length = code.type;
				if (code.type === 18) {
					info.checkBit = code.checkBit;
				}

				//记录cache
				this.cache[id].info = info;

				return info;
			},
			
			//仿造一个号
			makeID: function (isFifteen) {
				var GB2260 = this.GB2260 || null;

				//地址码
				var addr = null;
				if (GB2260 !== null) {
					var loopCnt = 0;
					while (addr === null) {
						//防止死循环
						if (loopCnt > 10) {
							addr = 110101;
							break;
						}
						var prov = util.str_pad(util.rand(50), 2, '0');
						var city = util.str_pad(util.rand(20), 2, '0');
						var area = util.str_pad(util.rand(20), 2, '0');
						var addrTest = [prov, city, area].join('');
						if (GB2260[addrTest]) {
							addr = addrTest;
							break;
						}
					}
				} else {
					addr = 110101;
				}

				//出生年
				var yr = util.str_pad(util.rand(99, 50), 2, '0');
				var mo = util.str_pad(util.rand(12, 1), 2, '0');
				var da = util.str_pad(util.rand(28, 1), 2, '0');
				if (isFifteen) {
					return addr + yr + mo + da + util.str_pad(util.rand(999, 1), 3, '1');
				}

				yr = '19' + yr;
				var body = addr + yr + mo + da + util.str_pad(util.rand(999, 1), 3, '1');

				//位置加权
				var posWeight = [];
				for (var i = 18; i > 1; i--) {
					var wei = util.weight(i);
					posWeight[i] = wei;
				}

				//累加body部分与位置加权的积
				var bodySum = 0;
				var bodyArr = body.split('');
				for (var j = 0; j < bodyArr.length; j++) {
					bodySum += (parseInt(bodyArr[j], 10) * posWeight[18 - j]);
				}

				//得出校验码
				var checkBit = 12 - (bodySum % 11);
				if (checkBit === 10) {
					checkBit = 'X';
				} else if (checkBit > 10) {
					checkBit = checkBit % 11;
				}
				checkBit = (typeof checkBit === 'number' ? checkBit.toString() : checkBit);

				return (body + checkBit);
			}

		}; //_IDValidator

		return _IDValidator;

	}();
	
	// 提示语
	var validateTip = {
		any: '内容不能为空',
		name: '姓名格式错误',
		id: '身份证号码格式错误',
		phone: '手机号码格式错误',
		email: '邮箱格式错误',
		check: '验证码错误',
		agreement: '请同意协议',
		custom: '内容有误',
		price: '请输入消费金额',
		repeat: '密码输入不一致',
		childid: '孩子身份证号码格式错误',
		address: '省市区不能为空',
		bankcard: '银行卡号需为6-30位数字'
	};
	
	//empty fn
	var emptyFn=function(){};
	
	// 检验规则
	var validateRule = {
		option: [
			[0, 100]
		],
		any: [
			[1, 100]
		],
		name: [
			[2, 15], '[\u4e00-\u9fa5]{1,}(·?)[\u4e00-\u9fa5]{1,}$'
		],
		id: [
			[15, 18], false,
			function (val) {
				var Validator = new IDValidator();
				return Validator.isValid(val) && getAge({
					year: val.slice(6, 10),
					month: val.slice(10, 12),
					date: val.slice(12, 14)
				}) > 0;
			}
		],
		phone: [
			[11, 11], '^1'
		],
		email: [
			[4, 30], '^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'
		],
		verificationCode: [
			[4, 6], false,
			function (val) {
				return val === ($(this).data('blz-validate-pattern') ? $(this).data('blz-validate-pattern').toString() : val);
			}
		],
		agreement: [false, false, function () {
			return $(this).prop('checked');
		}],
		repeat: [false, false, function (val) {
			return val === $($(this).data('blz-same')).val();
		}],
		childid: [
			[18, 18], false,
			function (val) {
				var Validator = new IDValidator();
				var obj = {
					year: val.slice(6, 10),
					month: val.slice(10, 12),
					date: val.slice(12, 14)
				};
				return Validator.isValid(val) && getAge(obj) > 0 && obj.year >= 2010;
			}
		],
		address: [false, false, function () {
			return this.selectedIndex !== 0;
		}],
		bankcard: [false, false, function (val) {
			return val.replace(/ /g, '').length >= 6 && val.replace(/ /g, '').length <= 30;
		}]
	};
	var validateConfig = {
		agreementSelector: '.mf-agreement',
		verificationCodeSelector: '.mf-send',
		checkElemSelector: '.mf-input:not([disabled])',
		warnClass: 'warn',
		parentSelector: '.mf-item',
		scrollSelector: document.body,
		autoValidate: true,
		getVerificationCode: emptyFn,
		canSubmit: emptyFn,
		onError: onError,
		onRight: onRight,
		onAutoError: onError,
		onAutoRight: onRight,
		validateRule: validateRule,
		count: 60,
		submitSelector: '[type="submit"]',
		getVerificationCodeTip: function (elem, data) {
			data.onSubmitError(elem, data);
		},
		onNoAgreement: function () {
			$.weui.tip('亲不同意协议<br>将无法提交表单哦！');
		},
		scrollCallback: emptyFn,
		onSubmitError: onSubmitError
	};

	// validate构造函数
	function Validate(obj) {
		$.extend(true, this, validateConfig, obj || {});
	}

	// 获取年龄函数
	function getAge(obj) {
		var age = 0,
			now = new Date(),
			year = now.getFullYear(),
			month = now.getMonth() + 1,
			date = now.getDate();
		var config = {
			year: year,
			month: month,
			date: date
		};
		obj = $.extend(config, obj || {});
		age = year - obj.year;
		if (age < 0) {
			return age;
		}
		if (obj.month > month) {
			age = age - 1;
		} else if (obj.month === month) {
			if (obj.date > date) {
				age = age - 1;
			} else {
				age = age + 1;
			}
		} else {
			age = age + 1;
		}
		return age;
	}

	// 验证输入值的合法性
	function isCorrect(rules, elem) {
		var tipLength = true,
			regular = true,
			customs = true,
			val = $.trim(elem.value),
			type = elem.dataset.blzValidateType;
		if (!type) {
			return true;
		}
		if (rules[type][0]) {
			tipLength = val.length >= rules[type][0][0] && val.length <= rules[type][0][1];
		}
		if (rules[type][1]) {
			regular = new RegExp(rules[type][1], 'g');
			regular = regular.test(val);
		}
		if (rules[type][2]) {
			customs = rules[type][2].call(elem, val);
		}

		return tipLength && regular && customs;
	}

	// 计数器函数
	function count(n, $target) {
		if (n >= 0) {
			$target.data('isCountStart', true).addClass('grey').html(n + ' 秒后重发');
			setTimeout(function () {
				count(--n, $target);
			}, 1000);
		} else {
			$target.removeClass('grey').html('获取验证码').data('isCountStart', false);
		}
	}

	// 验证错误提示
	function onSubmitError(elem, data) {
		var val = elem.value;
		if (val && val.length > 0) {
			$.weui.tip(elem.dataset.blzValidateTip || validateTip[elem.dataset.blzValidateType]);
		} else {
			$.weui.tip(elem.placeholder || validateTip[elem.dataset.blzValidateType]);
		}
		onBlur(elem, data);
	}

	function onError(elem, data) {
		$(elem).closest(data.parentSelector).addClass(data.warnClass);
	}

	function onRight(elem, data) {
		$(elem).closest(data.parentSelector).removeClass(data.warnClass);
	}

	function onBlur(elem, data) {
		if (isCorrect(data.validateRule, elem)) {
			// 验证通过
			data.onRight(elem, data);
			if (data.autoValidate) {
				clearTimeout($(elem).data('auto-validate-timer'));
			}
		} else {
			// 验证不通过
			data.onError(elem, data);
			if (data.autoValidate) {
				$(elem).data('auto-validate-timer', setTimeout(function () {
					onBlur(elem, data);
				}, 800));
			}
		}
	}

	// form serialize
	function serialize(form) {
		if (window.FormData) {
			return new FormData(form);
		}
		var parts = [],
			field = null,
			i,
			len,
			j,
			optLen,
			option,
			optValue;
		for (i = 0, len = form.elements.length; i < len; i++) {
			field = form.elements[i];
			switch (field.type) {
				case "select-one":
				case "select-multiple":
					if (field.name.length) {
						for (j = 0, optLen = field.options.length; j < optLen; j++) { // JavaScript Document
							option = field.options[j];
							if (option.selected) {
								optValue = "";
								if (option.hasAttribute) {
									optValue = (option.hasAttribute("value") ?
										option.value : option.text);
								} else {
									optValue = (option.attributes["value"].specified ?
										option.value : option.text);
								}
								parts.push(encodeURIComponent(field.name) + "=" +
									encodeURIComponent(optValue));
							}
						}
					}
					break;
				case undefined: //字段集
				case "file": //文件输入
				case "submit": //提交按钮
				case "reset": //重置按钮
				case "button": //自定义按钮
					break;
				case "radio": //单选按钮
				case "checkbox": //复选框
					if (!field.checked) {
						break;
					}
					/* 执行默认操作 */
				default:
					//不包含没有名字的表单字段
					if (field.name.length) {
						parts.push(encodeURIComponent(field.name) + "=" +
							encodeURIComponent(field.value));
					}
			}
		}
		return parts.join("&");
	}

	$.fn.blzSerialize = function () {
		if (this.length > 0) {
			return serialize(this[0]);
		} else {
			return '您没有选中任何form元素';
		}
	};

	// 检验函数
	$.fn.blzValidate = function (obj) {
		return this.each(function () {
			var data = new Validate(obj),
				$this = $(this).blzValidateOver().data('blz-validate', data),
				$elems = null;

			$elems = data.ValidateElems = $this.find(data.checkElemSelector);

			// 发送验证码
			$this.find(data.verificationCodeSelector).on('click.blzValidate', function () {
				var $this = $(this),
					$target = $(this.dataset.blzValidateTarget),
					val = $.trim($target.val());
				if ($this.data('isCountStart')) {

				} else {
					if (val.length === 11 && val[0] === '1') {
						data.getVerificationCode.call(this, $target[0]);
						count(data.count, $this);
					} else {
						data.getVerificationCodeTip($target[0], data);
					}
				}
			});

			// 协议交互
			$this.find(data.agreementSelector).on('change.blzValidate', function () {
				if (this.checked) {

				} else {
					data.onNoAgreement(this);
				}
			});

			// 失去焦点时验证
			$elems.on('blur.blzValidate blurSimulation', function () {
				onBlur(this, data);
			}).on('focus.blzValidate', function () {
				this.select();
			});

			$this.on('submit.blzValidate', function (event) {
				if (data.submitState === 'submiting') {
					event.preventDefault();
					$.weui.tip('数据提交中');
				} else {
					data.submitState = 'submiting';

					var i = 0,
						displacement = 0;

					for (i = 0; i < $elems.length; i++) {
						if (isCorrect(data.validateRule, $elems[i])) {

						} else {

							displacement = $elems[i].getBoundingClientRect().top - window.innerHeight / 2;
							setTimeout(function () {
								$(data.scrollSelector).blzScrollto({
									displacement: displacement,
									time: Math.abs(displacement * 1.5),
									callback: data.scrollCallback($elems[i])
								});
							}, 300);
							data.onSubmitError($elems[i], data);
							data.submitState = 'unpass';
							event.preventDefault();
							return;
						}
					}
					obj.canSubmit.call(this, event, data);
				}
			});
		});
	};

	//安卓bug修复
	if (/Android/gi.test(navigator.userAgent)) {
		$(window).on('resize.blzValidate', function () {
			if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
				window.setTimeout(function () {
					document.activeElement.scrollIntoViewIfNeeded();
				}, 30);
			}
		});
	}

	// 关闭表单验证
	$.fn.blzValidateOver = function () {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('blz-validate');
			$this.removeData('blz-validate');
			if (data) {
				$this.find(data.verificationCodeSelector).off('click.blzValidate');
				$this.find(data.agreementSelector).off('change.blzValidate');
				data.ValidateElems.off('blur.blzValidate blurSimulation focus.blzValidate');
				$this.off('submit.blzValidate');
			}

		});
	};

	// 表单验证组件卸载
	$.blzValidateOver = function (selector) {
		$(selector ? selector : 'form').blzValidateOver();
		$.fn.blzValidateOver = null;
		$.fn.blzValidate = null;
		$(window).off('resize.blzValidate');
		$.blzValidateOver = null;
	};

	return $;
});
