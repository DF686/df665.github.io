var tools = {
	/**
	 * 得到所有的GET参数
	 */		
	getGET:function(key){
		var ret = {};
		get = location.search.substr(1);
		if(get == ""){
			return typeof(key) != 'undefined' ? "" : {};
		}
		$.each(get.split('&'), function(k,v){
			var arr = v.split('=');
			if(arr.length < 2){
				ret[arr[0]] = "";
			}else{
				ret[arr[0]] = decodeURIComponent(arr[1]);
			}
		});
		if(typeof(key) != 'undefined'){
			return typeof(ret[key]) != 'undefined' ? ret[key] : "";
		}
		return ret;
	},
	
	/**
	 * 得到完整的url
	 *
	 * @param paramObj 参数对象，例如: {c:'user',a:'getinfo'}
	 */	
	getURL:function(paramObj){
		var uri = $.param(paramObj),
		url = 'http://'+BIZ_DOMAIN+'/service?'+uri;
		return url;
	},
	
	/**
	 * 异步得到 http get 请求结果
	 *
	 * @param paramObj 参数对象，例如: {c:'user',a:'getinfo'}
	 * @param callback 回调函数，例如: function(jsonObj){}
	 */
	ajaxGet:function(paramObj, callback){
		var uri = $.param(paramObj),
		url = 'http://'+BIZ_DOMAIN+'/service?'+uri;
		$.get(url, callback, 'jsonp');
	},
	
	/**
	 * post 数据
	 *
	 * @param paramObj 参数对象，例如: {c:'user',a:'getinfo'}
	 * @param callback 回调函数，例如: function(jsonObj){}
	 */
	ajaxPost:function(paramObj, postObj, callback){
		var uri = $.param(paramObj),
		url = 'http://'+BIZ_DOMAIN+'/service?'+uri;
		$.post(url, postObj, callback, 'json');
	},
	/**
	 * 缓存对象的基本操作
	 */
	cache:{
		get:function(key){
			var val = window.sessionStorage.getItem(key);
			if(val == null){
				return false;
			}
			return JSON.parse(val);
		},
		set:function(key,val){
			window.sessionStorage.setItem(key, JSON.stringify(val));
			return true;
		},
		del:function(key){
			window.sessionStorage.removeItem(key);
			return true;
		}
	},
	
	/**
	 * 永久缓存对象的基本操作
	 */
	localCache:{
		get:function(key){
			var val = window.localStorage.getItem(key);
			if(val == null){
				return false;
			}
			return JSON.parse(val);
		},
		set:function(key,val){
			window.localStorage.setItem(key, JSON.stringify(val));
			return true;
		},
		del:function(key){
			window.localStorage.removeItem(key);
			return true;
		}
	},	
			
	/**
	 * 写cookie
	 * @param {type} name
	 * @param {type} value
	 * @param {type} expireMin 有效期 默认当前会话期
	 * @param {type} domain 域名，默认当前访问的域名
	 * @returns {undefined}
	 */
	setCookie:function (name, value, expireMin, domain){
		if (!domain) {
			domain = location.hostname;
		}
		if (arguments.length > 2) {
			var expireTime = new Date(new Date().getTime() + parseInt(expireMin * 60 * 1000));
			document.cookie = name + "=" + escape(value) + "; path=/; domain=" + domain + "; expires=" + expireTime.toGMTString();
		} else {
			document.cookie = name + "=" + escape(value) + "; path=/; domain=" + domain;
		}
	},

	/**
	 * 读取cookie
	 * @param {type} name
	 * @returns {RegExp.$2|String}
	 */
	getCookie:function (name) {					
		var cookie = document.cookie;
		try {
			return (cookie.match(new RegExp("(^" + name + "| " + name + ")=([^;]*)")) == null) ? "" : decodeURIComponent(RegExp.$2);
		}
		catch (e) {
			return (cookie.match(new RegExp("(^" + name + "| " + name + ")=([^;]*)")) == null) ? "" : RegExp.$2;
		}
	},
	/**
	 * 格式化文件大小显示
	 *
	 */
	showFileSize:function(size) {
		var kb = 1024; // Kilobyte
		var mb = 1024 * kb; // Megabyte
		var gb = 1024 * mb; // Gigabyte
		var tb = 1024 * gb; // Terabyte
		var round = function(x){ 
			var f = parseFloat(x); 
			if (isNaN(f)){ 
				return 0; 
			} 
			f = Math.round(x*100)/100; 
			return f; 
		} 			
		if (size < kb) {
			return size + "B";
		} else if (size < mb) {
			return round(size / kb, 2) + "KB";
		} else if (size < gb) {
			return round(size / mb, 2) + "MB";
		} else if (size < tb) {
			return round(size / gb, 2) + "GB";
		} else {
			return round(size / tb, 2) + "TB";
		}
	},
	/**
	 * 不同平台打开QQ客服端
	 *
	 */	
	openQQ:function(qq){
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf('android') != -1;
		var isIos = ua.indexOf('iphone') != -1;
		var qqurl = 'http://wpa.qq.com/msgrd?v=3&site=qq&menu=yes&uin='+qq;
		if(isAndroid){
			qqurl="mqqwpa://im/chat?chat_type=wpa&uin="+qq;
		}
		if(isIos){
			qqurl="mqqwpa://im/chat?chat_type=wpa&uin="+qq+"&version=1&src_type=web&web_src=oicqzone.com";
		}
		window.open(qqurl);
		return false;	
	},
	
	/**
	 * 窗体滚动条事件
	 *
	 */	
	scrollEvent:function(callback){
		var win = $(window),
		doc = $(document);
		win.scroll(function(){
			var winScrTop = win.scrollTop(),
			winHeight = win.height(),
			docHeight = doc.height();
			console.log('window-scrollTop:',winScrTop, ' window-height:',winHeight, ' document-height:',docHeight);
			if (winScrTop + winHeight > docHeight - 300) {
				callback();
			}
		});		
	},
	
	/**
	 * 根据对象数组,解析html模板并返回
	 *
	 * @param tplId 模板标签的id
	 * @param dataObj 模块中要用到的数据对象
	 */		
	template:function(tplId, dataObj){
		_.tplData = dataObj;
		var compiled = _.template($('#'+tplId).html()),
		html = compiled();
		_.tplData = null;
		return html;			
	},
	
	/**
	 * 根据单个对象解析html模板并返回
	 *
	 * @param tplId 模板标签的id
	 * @param dataObj 模块中要用到的数据对象
	 */		
	templateOne:function(tplId, obj){
		var compiled = _.template($('#'+tplId).html()),
		html = compiled(obj);
		return html;			
	}				
};