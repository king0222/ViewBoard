define(['jquery'],function($,utils){
	//判断浏览器 
	var isIe6=navigator.userAgent.search(/msie 6.0/gi) != -1;
	var isIe7=navigator.userAgent.search(/msie 7.0/gi) != -1;
	var isIe8=navigator.userAgent.search(/msie 8.0/gi) != -1;
	var isIE678=isIe6||isIe7||isIe8;
	if(isIE678){
		// var placeholder = $(".search_wrap input").attr("placeholder");
		// $(".search_wrap input").val(placeholder);
		// $(".search_wrap input").attr({
		// 	"onfocus" : "javascript:if(this.value='" + placeholder + "'){console.log(1);this.value='';}",
		// 	"onblur" : "javascript:if(!this.value){this.value='" + placeholder + "';}"
		// });
		var $searchInput = $(".search_wrap input");
		var placeholder = $searchInput.attr("placeholder");
		$searchInput.val(placeholder).focus(function(){
			if($(this).val() == placeholder){
				$(this).val("");
			}
		}).blur(function(){
			if($(this).val()==""){
				$(this).val(placeholder);
			}
		}).next().click(function(){
			if($searchInput.val()==placeholder)return;
		});
	}

	//封装事件	
	var event=function(options){
		$(document).off(options.eventType,options.obj).on(options.eventType,options.obj,function(event){
			options.fn(this,event);
		});
	};
	var backtop = function(){
		var topHtml='<div id="backtop"></div>';
		$('body').append(topHtml);
		var backtopObj = $("div#backtop");
		var scrollTop = $(window).scrollTop();
		if(scrollTop>450){
			backtopObj.fadeIn();
		}else{
			backtopObj.fadeOut();
		}
		$(window).scroll(function(){
			var scrollTop=$(window).scrollTop();
			if(scrollTop>450){
				backtopObj.fadeIn();
			}else{
				backtopObj.fadeOut();
			}
		});
	};
	var fixedMenu = function(top, bottom){
		var menu = $(".content_menu").height();
		var menuTree = $(".content_menu_tree").height();
		var scroll = $(document).scrollTop();

		var footer = $(".footer").offset().top - menuTree;
		var menuTop = $(".content_menu").offset().top + menu;
		var $body = $("body");

		if(scroll > footer){
			$body.removeClass("pos-fixed");
		}else if(scroll > menuTop){
			$body.addClass("pos-fixed");
		} else {
			$body.removeClass("pos-fixed");
		}	
	};
	
	var common = {
		version: 4,
		"backtop" : backtop,//回到顶部
		"event" : event,
		"fixedMenu" : fixedMenu,
		user: {},
		getCookie: function( name){
            var cookieObj = document.cookie;
            var startIndex = cookieObj.indexOf(name);
            if(startIndex == -1) return null; // no cookie
            startIndex += name.length+1;
            var endIndex = cookieObj.indexOf(";",startIndex);
            if (endIndex == -1) endIndex = cookieObj.length;
            return unescape(cookieObj.substring(startIndex,endIndex));
        },
        /*setCookie: function(name, value, expiredays){
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie=name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
        },*/
        setCookie: function (name, value, expires, path, domain, secure){
        	var strCookie = name + "=" + value;
        	if(expires){
        		var curTime = new Date;
        		curTime.setTime(curTime.getTime()+24*expires*60*60*1e3);
        		strCookie += "; expires="+curTime.toGMTString();
        	}
        	strCookie += path ? "; path=" + path : "";
        	strCookie += domain ? "; domain=" + domain : "";
        	strCookie += secure ? "; secure" : "";
        	document.cookie = strCookie;
        },
        removeCookie: function(name) {
            var  exp  =  new  Date();
            exp.setTime  (exp.getTime()  -  1);
            var  cval  =  getCookie  (name);
            document.cookie  =  name  +  "="  +  cval  +  ";  expires="+  exp.toGMTString();
        },
        getRandom: function() {
        	return (function(color) {
                return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color); 
            })('');
        }
	};
	return common;
});




