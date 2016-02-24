define(['jquery'],function($){
	
	$.kDialog = function(options) {
		var defaults = {
			data: options.data,
			template: options.template || '',
			maskId: 'remindMask',
			popId: 'remind-dialog'+Math.random(),
			model: true,
			storage: false,
			storageId:'bannerTip'
		};
		var opts=$.extend({}, defaults, options);
		var o = $.meta ? $.extend({}, opts, $(this).data()) : opts;

		

		
		if (!o.content && !(o.data && o.template)) {
			throw '必须传入参数content || (data & template!)';
			return false;
		}

		if (!o.content) {
			o.content = genContent(o.data, o.template);
		}

		var w = o.width || 0,
			h = o.height || 0,
			dw = $(window).width(),
			dh = $(window).height(),
		top = -parseInt(h, 10);
		var d = 800, b = 0, c = 0;
		var count = 0, countx = 0; //500毫秒分多少次执行完毕	
		var storageName = opts.storageId;

		var style = '.promotion-popup img,.promotion-popup a{display:block;width:100%; border: none;outline: none;}.dialog-content > div{width:' + (100 / o.data.length) + '%;float:left;}';
		style += '.remind-dialog .left-arrow,.remind-dialog .right-arrow{width: 45px; height:100%;position:absolute;top:0;bottom:0;cursor:pointer; z-index: 999;background:url(/static/images/slider_prev.png) 0 center no-repeat;}';
		style += '.remind-dialog .right-arrow{background:url(/static/images/slider_next.png) 0 center no-repeat;right:0;}.remind-dialog .left-arrow.disable{display:none;}';
		style += '.remind-dialog .title{margin:0;background:#000;font-size: 18px;line-height:42px;text-indent:0.5em;color:#fff;}';
		style += '.remind-dialog .right-arrow.disable{display:none;}';

		loadStyleString(style); 

		

		var $dialog = genDialog();
		if (o.storage && window.localStorage && window.localStorage.getItem(storageName)) {
			return false;
		} else {
			var num = 0, $img = $dialog.find('img'), imgLen = $img.length, temImage = new Image();
			if (imgLen > 1) {
				// hotfix 3 - popup
				// genNav();
			}
			$img.each(function(i){
                var imgsrc=$(this).attr("src");
                $(this).load(function(){
                    ++num;
                    temImage.src = this.src;
                    if(num === imgLen){
                    	$dialog.show();
                    	if (navigator.userAgent.indexOf('MSIE') >= 0) {
                    		w = temImage.width;
                    	} else {
                    		w = $img[0].width;
                    	}
                    	
                    	h = $img[0].height;
                    	var $dwidth = $dialog.find('.remind-dialog').width();
                    	h = h * $dwidth / w;
                    	top = -parseInt(h, 10);
						b = -parseInt(h), c = parseInt((dh - h) / 2) - b;
						count = parseInt(d / 20), countx = count; //500毫秒分多少次执行完毕
                        showDialog();
                    }
                }).attr({"src":imgsrc});
            });
				
		}

		
		var easeInOutBack = function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		}

		function genContent(data, template) {
			var html = '';
			if (!Array.isArray(data)) {
				html += templateStr(template, data);	
			} else {
				for (var i = 0; i < data.length; i++) {
					html += templateStr(template, data[i]);	
				}
			}
			return html;			
		}
		
		function genMask() {
			var $mask = $('<div>', {
				'id': o.maskId
			}).css({
				'height': dh,
				'position': 'fixed',
				'-webkit-overflow-scrolling': 'touch',
				'overflow': 'hidden',
				'top': 0,
				'right': 0,
				'bottom': 0,
				'left': 0,
				'z-index': 999,
				'background': '#000',
				'opacity': 0.5,
				'display': 'none',
				'box-sizing': 'border-box',
				'outline': 'none'
			});
			return $mask;
		}

		function genDialog() {
			var $ch = $('<div>', {
				'class': 'close-holder'
			}).css({
				'position': 'relative',
				'height': '36px'
			}).append(genClose());

			var $dialog = $('<div>', {
				'class': 'remind-dialog',
				'id':o.popId
			}).css({
				// hotfix 3 - popup
				// 'width': '50%',
				'max-width': '700px',
				'padding': '0 50px',
				
				'margin': 'auto',
				'position': 'relative',
				'top': Math.abs((dh - h) / 2) + 'px',
				'z-index': 99999,
				'display': 'none'
			}).append($ch);

			var $content = $('<div>', {
				'class': 'dialog-content'
			}).css({
				'position': 'relative',
				'left': 0,
				'width': o.data.length + '00%',
				'transition': 'left .5s ease-out',
			    '-moz-transition': 'left .5s ease-out',
			    '-webkit-transition': 'left .5s ease-out',
			    '-o-transition': 'left .5s ease-out'
			}).append(o.content);

			var $contentHolder = $('<div>').css({
				'width': '100%',
				'height': '100%',
				'overflow': 'hidden'
			}).append($content);

			var $h = $('<div>', {
				'class': 'dialog-holder'
			}).css({
				'position': 'fixed',
				'top': 0,
				'bottom': 0,
				'left': 0,
				'right': 0,
				'overflow': 'auto',
				'overflow-y': 'scroll',
				'z-index': 10000,
				'display': 'none'
			});

			$h.append($dialog.append($contentHolder)).appendTo('body');

			return $h;
		}

		function genClose() {
			var $close = $('<span>', {
				'class': 'close'
			}).css({
				'width': '36px',
				'height': '36px',
				'background': 'url(/static/images/btn_close.png)no-repeat',
				'color': '#fff',
				'font-weight': 'bold',
				'cursor': 'pointer',
				'position': 'absolute',
				'border-radius': '24px',
				'top': '0',
				'right': '-36px',
				'z-index': 99999
			}).on('click', function() {
				hideDialog();
			});
			return $close;
		}

		function genNav() {
			var nav = '<div class="left-arrow disable"></div><div class="right-arrow"></div>';
			$dialog.find('.remind-dialog').append(nav);
			$dialog.find('.left-arrow').on('click', function() { 
				prev(); 
			});
			$dialog.find('.right-arrow').on('click', function() {
				next();
			});
		}

		var currentItem = 0;
		function prev() {
			if (currentItem == 0) {
				return false;
			}

			currentItem -= 1;
			$dialog.find('.dialog-content').css({'left': -(currentItem * 100) + '%'});
			if (currentItem == 0) {
				$dialog.find('.left-arrow').addClass('disable');
			} else {
				$dialog.find('.left-arrow').removeClass('disable');
			}
			$dialog.find('.right-arrow').removeClass('disable');
		}

		function next() {
			if (currentItem == $dialog.find('img').length - 1) {
				return false;
			}
			currentItem += 1;
			$dialog.find('.dialog-content').css({'left': -(currentItem * 100) + '%'});
			if (currentItem === $dialog.find('img').length -1) {
				$dialog.find('.right-arrow').addClass('disable');
			} else {
				$dialog.find('.right-arrow').removeClass('disable');
			}
			$dialog.find('.left-arrow').removeClass('disable');
		}
		

		function showDialog() {
			if (o.model) {
				if (!$('#' + o.maskId).length) {
					$('body').append(genMask());
				}
				if (!$('#' + o.maskId).is(':visible')) {
					$('#' + o.maskId).fadeIn();
				}
			}
			slideDown();
		}

		function slideDown() {
			var t = setInterval(function(){
				var top = easeInOutBack(0, d - (count-- * 20) , b, c, d);
				$dialog.find('.remind-dialog').css({
					// hotfix 3 - popup
					'top': 3*(parseInt(d / 20)-count) + 'px',	// fix in about 120px
					// 'top': top + 'px',
					'opacity': ((countx - count) / countx),
					'display': 'block'
				});
				if (count <= 0) {
					count = parseInt(d / 20);
					clearInterval(t);
				}
			}, 20);
		}

		function hideDialog() {
			if (o.close && $.isFunction(o.close)) {
					o.close($dialog);		
			}else{
				$dialog.fadeOut();
			}
			$('#' + o.maskId).fadeOut();
			if (o.storage) {
				if (window.localStorage) {
					window.localStorage.setItem(storageName, 'true');
				}
			}
		}

		$(window).on('resize', function() {
			dw = $(window).width();
			dh = $(window).height();
			h = $dialog.find('img').height();
			if ($dialog.is(':visible')) {
				$dialog.find('.remind-dialog').css({
					// hotfix 3 - popup
					'top': '120px'
					// 'top': (dh - h) / 2 + 'px'
				});
			}
			if ($('#' + o.maskId).is(':visible')) {
				$('#' + o.maskId).css({
					// hotfix 3 - popup
					// 'width': dw + 'px',
					// 'height': dh + 'px',
				});
			}
		});


		function loadStyleString(css) { 
			var style = document.createElement("style"); 
			style.type = "text/css"; 
			try { 
				style.appendChild(document.createTextNode(css)); 
			} catch (ex) { 
				style.styleSheet.cssText = css; 
			} 
			var head = document.getElementsByTagName("head")[0]; 
			head.appendChild(style); 
		} 
	};

});