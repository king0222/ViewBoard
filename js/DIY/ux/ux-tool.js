define(['jquery','ux/jquery.common', 'ux/ux-item', 'ux/ux-style', 'ux/ux-bg', 'canvas/merge', 'ux/ux-history', 'ux/ux-api', 'kindeditor', 'initEditor'], function($, common, $item, $style, $bg, merge, history, api, kindeditor, initEditor){
 	var $tool = {
 		descriptionEditor: null,
 		mobileDescriptionEditor: null,
		init : function(){
			this.event();
		},
		filters: {},
		guid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });
		},
		getSchema: function() {
			var dragTarget = document.querySelector('#drag-target'),
				dragItems = dragTarget.querySelectorAll('.drag-item:not(.handler)'),
				dragBg = dragTarget.querySelector('.drag-bg'),
				mergeArr = [],
				goodsArr = [];
			
			if (dragBg) {
				var obj = {
					isBg: true,
					rotate: 0,
					img: dragBg.getAttribute('data-src'), 
					width: dragBg.offsetWidth, 
					height: dragBg.offsetHeight, 
					top: dragBg.offsetTop, 
					left: dragBg.offsetLeft,
					zIndex: 0,
					json: JSON.parse(dragBg.getAttribute('data-json'))
				};
				mergeArr.push(obj);
			}
			var totalPrice = 0, totalDivideMoney = 0;
			Array.prototype.forEach.call(dragItems, function(item) {
				var imgsrc = item.getAttribute('data-src'),
				//transform: rotateX(0deg) rotateY(0deg) rotateZ(10.885527054658738deg) scale3d(1, 1, 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg); top: 69px; left: 44px; width: 400px; height: 176px; background-image: url(http://www.huashengju.com/design/images/DIY/img_thumb.png);
				//style = window.getComputedStyle ? window.getComputedStyle(item,null) : item.currentStyle; 
				
				style = item.getAttribute('style'),
				price = item.getAttribute('data-price'),
				price_sale = item.getAttribute('data-pricesale'),
				price_market = item.getAttribute('data-pricemarket'),
				divideMomey = item.getAttribute('data-dividemomey') || 0,
				name = item.getAttribute('data-name'),
				qualityName = item.getAttribute('data-qualityname'),
				detailUrl = item.getAttribute('data-detailurl'),
				size = item.getAttribute('data-size'),
				json = JSON.parse(item.getAttribute('data-json')),
				goodsId = item.getAttribute('data-goodsid'),
				proId = item.getAttribute('data-proid');
				var arr = style.split(';');
				var obj = {};
				for (var i = 0; i < arr.length; i++) {
					var item = arr[i].split(':');
					obj[$.trim(item[0])] = $.trim(item[1]);
				}
				var rotate = (obj['transform'] || obj['-webkit-transform']) ? parseInt((obj['transform'] || obj['-webkit-transform']).split(')')[2].slice(9)) : 0;
				var	mat = (obj['transform'] || obj['-webkit-transform']) ? (obj['transform'] || obj['-webkit-transform']).match(/scale3d\((\-?\d,?\s?){3}\)/) : null,
					matArr = (mat && mat[0]) ? mat[0].split('(')[1].split(')')[0].split(',') : null,
					flip = matArr ? matArr[0] : 1,
					flop = matArr ? matArr[1] : 1; 
				var zIndex = parseInt(obj['z-index']),
					width = obj['width'],
					height = obj['height'],
					top = obj['top'],
					left = obj['left'];
				var obj = {
					isBg: false,
					proId: proId,
					goodsId: goodsId,
					img: imgsrc, 
					width: parseInt(width), 
					height: parseInt(height), 
					top: parseInt(top), 
					left: parseInt(left), 
					rotate: parseInt(rotate), 
					flip: flip,
					flop: flop,
					zIndex: zIndex,
					price: price,
					price_sale: price_sale,
					price_market: price_market,
					divide_money: divideMomey,
					name: name,
					qualityName: qualityName,
					detailUrl: detailUrl,
					size: size,
					json: json
				};

				var obj2 = {
					proId: proId,
					goodsId: goodsId,
					goodsNum: 1,
					top_pos: 0,
					left_pos: 0,
					order_id: 0
				};
				if (goodsArr.length) {
					var tag = true;
					for (var j = 0; j < goodsArr.length; j++) {
						if (goodsArr[j].goodsId == obj2.goodsId) {
							goodsArr[j].goodsNum += 1;
							tag = false;
							break;
						}
					}
					if (tag) {
						goodsArr.push(obj2);
					}
				} else {
					goodsArr.push(obj2);
				}
				
				totalPrice += Number(price_sale);
				totalDivideMoney += Number(divideMomey);
				mergeArr.push(obj);
			});
			mergeArr.sort(function(a, b) {
				return a['zIndex'] - b['zIndex'];
			});
			return {
				goodsArr: goodsArr,
				mergeArr: mergeArr,
				count: dragItems.length,
				price: totalPrice,
				divide_money: totalDivideMoney,
				statusCode: 2,
				status: '未提交审核'
			};
		},
		showLoginDialog: function(message) {
			$('<p>' + message + '</p>').dialog({
				width: 300,
				height: 150,
				buttons: {
					'取消': function() {
						$(this).dialog('close');
					},
					'前往登录': function() {
						$tool.goLogin();
					}
				}
			});
		},
		goLogin: function() {
			var $loginCookieData = $('.login_cookie_data');
			var refererUrl = $loginCookieData.attr('refererUrl');
			var cookiepre = $loginCookieData.attr('cookiepre');
			var cookiepath = $loginCookieData.attr('cookiepath');
			var cookiedomain = $loginCookieData.attr('cookiedomain');
			var cookieName = cookiepre + 'refererUrl';
			
			common.setCookie(cookieName, refererUrl, 0 , cookiepath, cookiedomain);
			window.location.href = '/user-login.html';
		},
		initDialog: function() {
			var $schemaHolder = $('#schemaHolder'),
				$areaCheck = $schemaHolder.find('.area input'),
				$label = $schemaHolder.find('.area label');
			$schemaHolder.find('.schema-name').val('');
			$schemaHolder.find('.style').val(1);
			$schemaHolder.find('.space').val('');
			//$schemaHolder.find('.rebate').val('');
			$schemaHolder.find('.file360').val('');
			$areaCheck.prop('checked', false);
			$label.removeClass('active');
			$areaCheck.eq(0).prop('checked', true);
			$label.eq(0).addClass('active');
			$('#description, #mobileDescription').val('');
			$tool.action = 'add';
		},
		cacheCurrentSchema: function(list) {
			var areaid = list.areaid;
			if (areaid) {
				areaid = areaid.join(',');
			} else {
				areaid = '';
			}
			$('#schemaInfoHolder').attr({
				'data-name': list.name,
				'data-space': list.space,
				'data-mcid': list.mcid,
				'data-style': list.style,
				'data-area': areaid,
				'data-price': list.price
			}).data('old_goods_num', JSON.stringify(list.old_goods_num));
		},
		removeItem: function() {
			if($("#handler:visible")[0]){
				var $target = $("#" + $("#handler").attr("data-handlerid")),
				zIndex = parseInt($target.css('z-index'));
				var $siblings = $target.siblings('.drag-item').not($('#handler')[0]);
				$siblings.each(function() {
					var z = parseInt($(this).css('z-index'));
					if (z > zIndex) {
						$(this).css({
							'z-index': z - 1
						});
					}
				});
				$target.remove();
				$item.unselect();
				$("#handler").hide().attr({'data-handlerid': '', 'data-resoureidid': ''});
				if (!document.querySelector('#drag-target .drag-bg')) {
					$bg.hideTools();
					$bg.unselect();
				}
				$('#prodectDetail').hide().find('.content').empty();
				$('#attrStyle .content').empty();
				history.push($('#drag-target').html());
			}
		},
		copyItem: function() {
			var $target = $("#drag-target");
			var $handler = $("#handler");
			
			var $item = $("#" + $handler.attr("data-handlerid"));
			if ($item.length) {
				// console.log($item.attr("data-resoureidid"));
				// console.log($item.parent().children(".widget[data-resoureid='" + $item.attr("data-resoureid") + "']:last").css("z-index"));
				var index = parseFloat($item.parent().children(".widget:last").css("z-index")) + 1;
				// console.log($item.siblings(".drag-item.widget:last").attr("id"));

				
				var $clone = $item.clone();
				var html = $clone.css({
					"z-index" : index,
					"top" : parseFloat($item.css("top")) + 20,
					"left" : parseFloat($item.css("left")) + 20
				}).attr("id", "drag-handler-" + index);
				// console.log(html);
		        var resoureid = $(html).attr("data-resoureid");
				var handlerid = $(html).attr("id");
				$handler.attr({
					"style" : $(html).attr("style"),
			    	"data-resoureid" : resoureid,
			    	"data-handlerid" : handlerid
				}).css({
					"z-index" : 998,
					"background" : "none",
					"display" : "block"
				});
				$target.append(html);
				history.push($('#drag-target').html());
			}
		},
		validateSchema: function() {
			var schemaName = $('#schemaHolder .schema-name').val(), tag = true;
			if (!schemaName) {
				tag = false;
				$('#schemaHolder .schema-name-row').addClass('error');
			} else {
				$('#schemaHolder .schema-name-row').removeClass('error');
			}
			var $areas = $('#schemaHolder').find('.area input:checked');
			if (!$areas.length) {
				tag = false;
				$('#schemaHolder .area-row').addClass('error');
			} else {
				$('#schemaHolder .area-row').removeClass('error');
			}
			/*var rebate = $('#schemaHolder .rebate').val();
			if (!rebate || (rebate && isNaN(rebate))) {
				tag = false;
				$('#schemaHolder .rebate-row').addClass('error');
			} else {
				$('#schemaHolder .rebate-row').removeClass('error');
			}*/
			return tag;
		},
		event : function(){
			common.event({
				obj : "#aside aside .tab ul li",
				eventType : "click",
				fn : function($this,e){
					$($this).addClass("active").siblings(".active").removeClass("active");
					var id = $($this).attr("data-id");
					$("#" + id).addClass("active").siblings(".active").removeClass("active");
				}
			});
			//新建
			common.event({
				obj : "#menu-tool li .new",
				eventType : "click",
				fn : function($this){
					if ($("#drag-target .drag-item:not(.handler), #drag-target .drag-bg").length < 1) {
						return false;
					}
					var r=confirm("您确定要重新创作吗！");
					if (r) {
						$("#drag-target .drag-item:not(.handler), #drag-target .drag-bg").remove();
						$item.unselect();
						$bg.hideTools();
						$('#handler').hide();
						$('#prodectDetail').hide().find('.content').empty();
						$('#attrStyle .content').empty();
						$('#schemaInfoHolder').attr({
							'data-name': '',
							'data-space': '',
							'data-mcid': '',
							'data-style': '',
							'data-area': '',
							'data-price': ''
						}).data('old_goods_num', '');

						$tool.initDialog();

						history.push($('#drag-target').html());
					}
				}
			});
			
			//选择区域
			common.event({
				obj: '.area label',
				eventType: 'click',
				fn: function($this, e) {
					e.preventDefault();
					var $this = $($this);
					if ($this.hasClass('active') && !$this.siblings('.active').length) {
						return false;
					}
					var $this = $($this).toggleClass('active');
					$this.find('input').prop('checked') ? $this.find('input').prop('checked', false) : $this.find('input').prop('checked', true);
					return false;
				}
			});
			//切换pc/移动版kindeditor编辑器
			common.event({
				obj: '.schema-next .tab li',
				eventType: 'click', 
				fn: function($this) {
					var $this = $($this);
					if ($this.hasClass('active')) {
						return false;
					}
					$this.addClass('active').siblings().removeClass('active');
					var hash = $this.attr('data-hash');
					$($this.attr('data-hash')).show().siblings().hide();
				}
			});
			//下载
			common.event({
				obj: '#menu-tool ul li .download',
				eventType: 'click',
				fn: function($this) {
					var mergeArr = $tool.getSchema().mergeArr;
					if (!mergeArr.length) {
						alert('空方案无法下载！');
						return false;
					}
					var dragTarget = document.querySelector('#drag-target'),
						imgArr = [];
					function loadimg(obj) {
						var img = new Image();
						img.onload = function() {
							imgArr.push(this);
							obj.img = this;
							if (mergeArr.length === imgArr.length) {
								merge.merge(dragTarget.offsetWidth, dragTarget.offsetHeight, mergeArr);
							}
						}
						img.crossOrigin = '';
						img.src = obj.img;
					}
					Array.prototype.forEach.call(mergeArr, function(obj) {
						loadimg(obj);
					});
				}
			});
			//撤销
			common.event({
				obj: '#menu-tool ul .undo',
				eventType: 'click',
				fn: function($this) {
					var content = history.prev();
					if (content) {
						$('#drag-target').empty().append(content);	
					}					
				}
			});
			//重做
			common.event({
				obj: '#menu-tool ul .redo',
				eventType: 'click',
				fn: function($this) {
					var content = history.next();
					if (content) {
						$("#drag-target .drag-item:not(.handler), #drag-target .drag-bg").remove();
						$('#drag-target').empty().append(content);
					}
				}
			});
			//选择背景
			common.event({
				obj : ".bg-tools .unlock",
				eventType : "click",
				fn : function($this){
					$item.unselect();
					$bg.selected();
				}
			});
			//锁定背景
			common.event({
				obj: '.bg-tools .lock',
				eventType: 'click',
				fn: function($this) {
					$bg.unselect();
				}
			});
			//平铺背景
			common.event({
				obj: '.bg-tools .full',
				eventType: 'click',
				fn: function($this) {
					$bg.fullscreenBackground({item: $('#drag-target .drag-bg')});
					$item.unselect();
					history.push($('#drag-target').html());
				}
			});
			//删除
			common.event({
				obj : "#menu-tool ul li .del",
				eventType : "click",
				fn : function($this){
					$tool.removeItem();
					
				}
			});
			$(document).unbind('keydown').bind('keydown', function (event) {
			    var doPrevent = false;
			    if (event.keyCode === 8) {
			        var d = event.srcElement || event.target;
			        if ((d.tagName.toUpperCase() === 'INPUT' && 
			             (
			                 d.type.toUpperCase() === 'TEXT' ||
			                 d.type.toUpperCase() === 'PASSWORD' || 
			                 d.type.toUpperCase() === 'FILE' || 
			                 d.type.toUpperCase() === 'SEARCH' || 
			                 d.type.toUpperCase() === 'EMAIL' || 
			                 d.type.toUpperCase() === 'NUMBER' || 
			                 d.type.toUpperCase() === 'DATE' )
			             ) || 
			             d.tagName.toUpperCase() === 'TEXTAREA') {
			            doPrevent = d.readOnly || d.disabled;
			        }
			        else {
			            doPrevent = true;
			        }
			    }

			    if (doPrevent) {
			        event.preventDefault();
			    }
			});
			$(document).on('keyup', function(e) {
				e.preventDefault();
				if (e.keyCode == 8 && !($('input').is(':focus'))) {
					$tool.removeItem();
				}
				if (e.keyCode == 67 && e.ctrlKey) {
					$tool.copyItem();
				}
				e.returnValue = false;
				return false;
			});
			//居中
			common.event({
				obj : "#menu-tool ul li .center",
				eventType : "click",
				fn : function($this){
					// // console.log(center);
					var result = $item.center({
						ele : "#drag-target .drag-item:not(.handler)",
					});
					var left = result.left;
					var top = result.top;
					$("#drag-target .drag-item:not(.handler)").each(function(){
						$(this).css({
							"left" : $(this).offset().left - left,
							"top" : $(this).offset().top - top
						});
					});
					$("#handler").css({
						"left" : $("#handler").offset().left - left,
						"top" : $("#handler").offset().top - top
					});
					history.push($('#drag-target').html());
				}
			});
			
			//复制
			common.event({
				obj : ".tool .copy",
				eventType : "click",
				fn : function($this,e){
					$tool.copyItem();
				}
			});
			//放大，缩小
			common.event({
				obj : ".tool .big,.tool .small",
				eventType : "click",
				fn : function($this,e){
					if($('#drag-target .drag-item').length <= 1) {
						return false;
					}
					var $handler = $("#handler");
					var num = 20;
					var width = $handler.width();
					var height = $handler.height();
					if(!$($this).hasClass("big")){
						num = num * (-1);
					}
					var css = {
		                'width' :  width + width * (num/100),
		                'height' : height +  height * (num/100)
		            };
					$handler.css(css);
			        $("#" + $handler.attr("data-handlerid")).css(css);
			        $style.resize.item();
			        history.push($('#drag-target').html());
				}
			});
			//上一层，下一层，置顶，置底
			common.event({
				obj : ".tool .up,.tool .down,.tool .top,.tool .bottom",
				eventType : "click",
				fn : function($this,e){
					if($('#drag-target .drag-item').length <= 1) {
						return false;
					}
					var $handler = $("#handler");
					var $item = $("#" + $handler.attr("data-handlerid"));

					if ($item.hasClass('drag-bg')) {
						return false;
					}
					var $itemSiblings;
					var index = parseInt($item.css("z-index"));
					var length = $item.siblings(".drag-item:not(.handler)").andSelf().length;
					var result;
					var isUp = $($this).hasClass("up"),//上一层
						isDown = $($this).hasClass("down"),//下一层
						isTop = $($this).hasClass("top"),//置顶
						isBottom = $($this).hasClass("bottom");//置底
						
					if(((isUp || isTop)&& index == length) || ((isDown || isBottom) && index==1)){
						return;
					}
					if(isUp){
						result = index + 1;
					}else if(isDown){
						result = index - 1;
					}else if(isTop){
						result = length;
					}else{
						result = 1;
					}
					if(result >= 1 && result <= length){
						if(isUp){
							$itemSiblings = $item.siblings(".drag-item[style*='z-index: " + result + "']");
							$itemSiblings.css('z-index' , index);
						}else if(isDown){
							$itemSiblings = $item.siblings(".drag-item[style*='z-index: " + result + "']");
							$itemSiblings.css('z-index' , index);
						}else if(isTop){
							$item.parent().find(".drag-item:not(.handler)").each(function(){
								$(this).css("z-index", parseInt($(this).css("z-index")) - 1);
							});
						}else{
							$item.parent().find(".drag-item:not(.handler)").each(function(){
								$(this).css("z-index", parseInt($(this).css("z-index")) + 1);
							});
						}
						var css = {
			                'z-index' : result
			            };
				        $item.css(css);
						history.push($('#drag-target').html());
					}
				}
			});
			//水平翻转，垂直翻转
			common.event({
				obj : ".tool .flip,.tool .flop",
				eventType : "click",
				fn : function($this,e){
					if($('#drag-target .drag-item').length <= 1) {
						return false;
					}
					var $handler = $("#handler");
					var $item = $("#" + $handler.attr("data-handlerid"));
					var rotateX = rotateY = 1, rotateZ;
					if($($this).hasClass("flop")){
						if($item.attr("style").indexOf("(1,") != -1){//水平翻转
							rotateX = -1;
						}else{
							rotateX = 1;
						}
						if($item.attr("style").indexOf("-1, 1)") == -1){//垂直翻转
							rotateY = 1;
						}else{
							rotateY = -1;
						}
					}else{
						if($item.attr("style").indexOf("(1,") != -1){//水平翻转
							rotateX = 1;
						}else{
							rotateX = -1;
						}
						if($item.attr("style").indexOf("-1, 1)") == -1){//垂直翻转
							rotateY = -1;
						}else{
							rotateY = 1;
						}
					}
					rotateZ = $style.rotate.get({
						ele : $handler,
						type : "Z"
					});
					// console.log(rotateZ + "," + rotateX + "," + rotateY);
					var css = {
		               "transform" : "rotateX(0deg) rotateY(0deg) rotateZ(" + rotateZ + "deg) scale3d(" + rotateX + ", "+ rotateY + ", 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)",
		               // "-webkit-transform" : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(" + rotateX + ", " + rotateY + ", 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)"
		            };
			        $item.css(css);
			        history.push($('#drag-target').html());
				}
			});
			
			
			
			//打开搜索条件过滤框
			common.event({
				obj: '#products .product-filter',
				eventType: 'click',
				fn: function($this) {
					$('#productFilter').addClass('show-filter');
					var offset = $($this).offset();
					$('#productFilter').css({
						top: offset.top + 30 + 'px',
						left: '5px'
					}).toggle();
				}
			});
			//关闭搜索条件过滤框
			common.event({
				obj: '#productFilter .close',
				eventType: 'click',
				fn: function($this) {
					$('#productFilter').toggle();
				}
			});
			//点击选择颜色过滤条件
			common.event({
				obj: '#productFilter .color',
				eventType: 'click',
				fn: function($this) {
					$($this).toggleClass('active');
				}
			});
			//点击切换布局
			common.event({
				obj: '.layouts button',
				eventType: 'click',
				fn: function($this) {
					if ($($this).hasClass('active')) {
						return false;
					}
					$($this).addClass('active').parent('li').siblings('li').find('button').removeClass('active');
					var klass = $($this).attr('class');
					if (klass.indexOf('fullscreen') != -1) {
						$('#aside, #attr').hide();
					}
					if (klass.indexOf('leftmenu') != -1) {
						$('#aside').show();
						$('#attr').hide();
					}
					if (klass.indexOf('rightmenu') != -1) {
						$('#aside').hide();
						$('#attr').show();
					}
					if (klass.indexOf('originlayout') != -1) {
						$('#aside, #attr').show();
					}
				}
			});
			//去登陆
			common.event({
				obj: '.go-login, .user-layouts a',
				eventType: 'click',
				fn: function($this) {
					$tool.goLogin();
				}
			});
			//弹出收起单品详情
			common.event({
				obj: '#prodectDetail .pin',
				eventType: 'click',
				fn: function($this) {
					$($this).toggleClass('active');
					$('#prodectDetail').toggleClass('hide-detail');
					$($this).toggleClass('toggle-pin');
				}
			});
			//弹出收起属性面板
			common.event({
				obj: '#attr .pin',
				eventType: 'click',
				fn: function($this) {
					$($this).toggleClass('active');
					$('#attr').toggleClass('hide-attr');
				}
			})
		}
	};
	return $tool;
});
 