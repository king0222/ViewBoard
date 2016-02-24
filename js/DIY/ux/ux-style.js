define(['jquery', 'ux/jquery.common'],function($, common){
	var $style = {
		config : {
			headerHeight : null,
			asideWidth : null,
			sliderObj : null,
			resize : {
				width : null,
				height : null
			},
			target : {
				max : {
					width : null,
					height : null
				},
				min : {
					width : null,
					height : null
				}
			},
			rotate : {
				cx : null,
				cy : null
			}
		},
		init : function(){
			this.config.target.max = this.target.wrap("max");
			this.config.target.min = this.target.wrap("min");
			this.config.sliderObj = this.resize.slider.init();
			// // console.log();
			this.resize.slider.event();
		},
		target : {
			wrap : function(type){
				var width,height;
				if(type === "max"){
					var $target = $("#drag-target");
					width = $target.width();
					height = $target.height();
				}else{
					width = 36;
					height = 36;
				}
				return {
					width : width,
					height : height
				}
			},
		},
		isOverflow : function(options){
			var flag = false;
			var num = options.num;
			var width = options.width;
			var height = options.height;
			var resizeH,resizeW;
			if(width > height){
				resizeH = height + num;
				resizeW = (width * resizeH) / height;
			}else{
				resizeW = width + num;
				resizeW = (height * resizeW) / width;
			}
			if(resizeW >= $style.config.target.max.width || resizeH >= $style.config.target.max.height || resizeW <= $style.config.target.min.width || resizeH <= $style.config.target.min.height){
				flag = true;
			}
			return flag;
		},
		rotate : {
			get : function(options){
				var $ele = options.ele;
				var type = options.type;
				///(rotateZ\([\-\+]?((\d+|\d+(\.\d+))(deg))\))/i;
				var reg = new RegExp("(rotate" + type +  "\\([\\-\\+]?((\\d+|\\d+(\\.\\d+))(deg))\\))", "i");
				return parseFloat($ele.attr("style").match(reg)[3]);
			},
			calPointAngle : function(options){

			}
		},
		resize : {
			slider : {
				init : function(){
					return $("#slider").slider({
						value : 100,
						min: 5,
						max: 200,
						step: 0.05,
						slide: function( event, ui ) {
							$style.resize.item(ui.value);
						}
					});
				},
				event : function(){
					common.event({
						obj : "#sliderValue",
						eventType : "blur",
						fn : function($this,e){
							var val = $($this).val()/2;
							if(val < 0){
								val = 0;
							}else if(val > 100){
								val = 100;
							}
							$style.resize.item(val);
						}
					});
				},
			},
			item : function(val){
				var $handler = $("#handler"),
					$target = $('#' + $handler.attr('data-handlerid'));
				var json = JSON.parse($target.attr("data-json"));
				var width = json.css.width;
				var height = json.css.height;
				
				var num = 0;
				var css = {};
				if(val || val == 0){
					num = val / 100;
					css = {
			            'width' :  width * num + 'px',
			            'height' : height * num + 'px'
			        };
			        num = num * 100;
				}else{
					num = Math.round($handler.width()/width * 100);
					if( num < 0 || num > 200){
						return;
					}
					val = num;
				}
				
				$handler.css(css);
		        $("#" + $handler.attr("data-handlerid")).css(css);
		        
		        $("#sliderValue").val(num);
		        $style.config.sliderObj.slider("value", val);

		        var $handler = $("#handler");
			    var width = $handler.width();
				var height = $handler.height();
				var minNum = Math.min(width, height);
				var position = {};
				if(minNum >= height){
					position = {
						"top" : minNum >= height ? 0 : parseFloat(width)/2,
						"left" : minNum >= width ? 0 : parseFloat(height)/2
					};
				}
				$handler.find(".measure-tool").css({
					"width" : minNum,
					"height" : minNum,
					"top" : 0,
					"left" : parseFloat(width-minNum)/2
				});
				$("#resizeW").val(width);
				$("#resizeH").val(height);
				$("#attrResize").addClass("active");
			},
			addResizemove : function($this,e,cls){
				var $handler = $("#handler");
				window.y = e.pageY;
	            window.x = e.pageX;
	            window.y1 = e.pageY;
	            window.x1 = e.pageX;
	            var cx = $handler.position().left;
				var cy = $handler.position().top;
	            $style.config.rotate = {
	            	cx : $handler.position().left + $handler.width()/2,
	            	cy : $handler.position().top + $handler.height()/2,
	            };
				$style.config.resize.width = $handler.width();
				$style.config.resize.height = $handler.height();
				$style.config.resize.top = parseFloat($handler.css("top"));
				$style.config.resize.left = parseFloat($handler.css("left"));
				 $(document).bind('mousemove',function(event){
				 	$style.resize.resizeMove(event,cls);
				 });
	            // $(document).bind('mousemove',$resize.resizeMove);
			},
			resizeMove : function(event,cls){
				var e = event;
				// // console.log(e);
				// $style.move.val.dragable = true;
	            mousey = e.pageY;
	            mousex = e.pageX;
				var num = 0;
				if(e.pageX == window.x && e.pageY == window.y){
					return;
				}
				var $handler = $("#handler");
				// var json = JSON.parse($handler.attr("data-json"));
				var width = $style.config.resize.width;
				var height = $style.config.resize.height;
				// var width = $handler.width();
				// var height = $handler.height();
				var r = $style.config.resize.width/$style.config.resize.height;
				var resizeW, resizeH;
				
				var top = parseFloat($handler.css("top"));
				var left = parseFloat($handler.css("left"));
				var bottom = parseFloat($handler.css("bottom"));
				var right = parseFloat($handler.css("right"));
				var css = {};
				if(cls == "nw"){
					if(e.pageX < window.x || e.pageY < window.y){
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY));
					}else{
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY)) * -1;
					}
					if(width > height){
						resizeH = height + num;
						resizeW = resizeH * r;
						css = {
							"width" : resizeW,
							"height" : resizeH,
							"top" : $style.config.resize.top + num * (-1),
							"left" : $style.config.resize.left + num * (-1) * r
						};
					}else{
						resizeW = width + num;
						resizeH = resizeW / r;
						css = {
							"width" : resizeW,
							"height" : resizeH,
							"top" : $style.config.resize.top + num * (-1) * r,
							"left" : $style.config.resize.left + num * (-1)
						};
					}
					
					if(resizeW <= 50 || resizeH <= 50){
						return;
					}
				
				}else if(cls == "ne"){
					if(e.pageX > window.x || e.pageY < window.y){
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY));
					}else{
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY)) * -1;
					}
					if(width > height){
						resizeH = height + num;
						resizeW = resizeH * r;
						css = {
							"width" : resizeW,
							"height" : resizeH,
							"top" : $style.config.resize.top + num * (-1)
						};
					}else{
						resizeW = width + num;
						resizeH = resizeW / r;
						css = {
							"width" : resizeW,
							"height" : resizeH,
							"top" : $style.config.resize.top + num * (-1) * r
						};
					}
					if(resizeW <= 50 || resizeH <= 50){
						return;
					}
				}else if(cls == "se"){
					if(e.pageX > window.x || e.pageY > window.y){
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY));
					}else{
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY)) * -1;
					}
					if(width > height){
						resizeH = height + num;
						resizeW = resizeH * r;
						css = {
							"width" : resizeW,
							"height" : resizeH
						};
					}else{
						resizeW = width + num;
						resizeH = resizeW / r;
						css = {
							"width" : resizeW,
							"height" : resizeH
						};
					}
					if(resizeW <= 50 || resizeH <= 50){
						return;
					}
				}else if(cls == "sw"){
					if(e.pageX < window.x || e.pageY > window.y){
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY));
					}else{
						num = Math.abs(Math.max(window.x - e.pageX, window.y - e.pageY)) * -1;
					}
					if(width > height){
						resizeH = height + num;
						resizeW = resizeH * r;
						css = {
							"width" : resizeW,
							"height" : resizeH,
							"left" : $style.config.resize.left + num * (-1) * r
						};
					}else{
						resizeW = width + num;
						resizeH = resizeW / r;
						css = {
							"width" : resizeW,
							"height" : resizeH,
							"left" : $style.config.resize.left + num * (-1)
						};
					}
					if(resizeW <= 50 || resizeH <= 50){
						return;
					}
				}else if(cls == "z"){
					// // console.log($handler);
					// // console.log($handler.attr("style").match(/(rotateZ\([\-\+]?((.\d+)(deg))\))/i));
					// var rotateZ = parseFloat($handler.attr("style").match(/(\([\-\+]?(([\s|\S]*)(deg))\))/i)[3]);
					var rotateZ = $style.rotate.get({
						ele : $handler,
						type : "Z"
					});
					var ev = e;
					
					var containerOffset = $handler.offset();
					var offsetX = containerOffset['left'];
					var offsetY = containerOffset['top'];
					var cx = $style.config.rotate.cx;
					var cy = $style.config.rotate.cy;

					var mouseX = ev.pageX - $("#aside").width();//计算出鼠标相对于画布顶点的位置,无pageX时用clientY + body.scrollTop - body.clientTop代替,可视区域y+body滚动条所走的距离-body的border-top,不用offsetX等属性的原因在于，鼠标会移出画布
					var mouseY = ev.pageY - $("#header").height();
					var ox = mouseX - cx;//cx,cy为圆心
					var oy = mouseY - cy;
					
					var to = Math.abs( ox/oy );
					var angle = Math.atan( to )/( 2 * Math.PI ) * 360;//鼠标相对于旋转中心的角度
					if( ox == 0 || oy == 0 )
					{
						if( ox == 0 && oy > 0 )
						{ 
							angle = 180;
						}else if( ox == 0 && oy < 0 )
						{ 
							angle = 0;
						}else if( oy == 0 && ox > 0 )
						{
							angle = 90;
						}else if( oy == 0 && ox < 0 )
						{ 
							angle = 270; 
						}
					}else
					{
						// to = Math.abs( ox/oy );
						// // // console.log(to);
						// angle = Math.atan( to )/( 2 * Math.PI ) * 360;
						// // console.log(angle);
						//js中x,y的顶点在左上角
						if( ox > 0 && oy < 0 )//第二点在1象限,相对坐标系是第1象限，相对节点本身就是第四象限
						{
							angle = angle;
							// console.log("右上角");
						}else if( ox > 0 && oy > 0 )//第二点在2象限
						{
							angle = 180 - angle;
							// console.log("右下角");
						}else if( ox < 0 && oy > 0 )//第二点在3象限
						{
							angle = 180 + angle ;
							// console.log("左下角");
						}else if( ox < 0 && oy < 0 )//第二点在4象限
						{
							angle = 360 - angle;
							// console.log("左上角");
						}
					}
					rotateNum = angle;
				    rotateZ = $style.rotate.get({
						ele : $handler,
						type : "Z"
					});
			     	css = $handler.attr("style").replace("rotateZ(" + rotateZ + "deg)", "rotateZ(" + parseFloat(rotateNum) + "deg)");
			        $handler.attr("style",css);
			        rotateZ = $style.rotate.get({
						ele : $("#" + $handler.attr("data-handlerid")),
						type : "Z"
					});
					css = $("#" + $handler.attr("data-handlerid")).attr("style").replace("rotateZ(" + rotateZ + "deg)", "rotateZ(" + parseFloat(rotateNum) + "deg)");
					$("#" + $handler.attr("data-handlerid")).attr("style", css);
			        $style.resize.item();
			        $style.rebuildHandler(rotateNum);
			        return;
				};
				/*if($style.isOverflow({width : width, height : height, num : num})){
					return;
				}*/
				$handler.css(css);
				$("#" + $handler.attr("data-handlerid")).css(css);
				$style.resize.item();
			}
		},
		rebuildHandler: function(angle) {
			var $resizeTL = $('#resizeTL'),
				$resizeTR = $('#resizeTR'),
				$resizeBR = $('#resizeBR'),
				$resizeBL = $('#resizeBL'),
				klass_tl = 'resize widget nw',
				klass_tr = 'resize widget ne',
				klass_br = 'resize widget se',
				klass_bl = 'resize widget sw';
			if (angle < 45 || angle > 315) {
				$resizeTL.attr('class', klass_tl).css({cursor: 'nw-resize'});
				$resizeTR.attr('class', klass_tr).css({cursor: 'ne-resize'});
				$resizeBR.attr('class', klass_br).css({cursor: 'se-resize'});
				$resizeBL.attr('class', klass_bl).css({cursor: 'sw-resize'});
			}
			if (angle >= 45 && angle < 135) {
				$resizeBL.attr('class', klass_tl).css({cursor: 'nw-resize'});
				$resizeTL.attr('class', klass_tr).css({cursor: 'ne-resize'});
				$resizeTR.attr('class', klass_br).css({cursor: 'se-resize'});
				$resizeBR.attr('class', klass_bl).css({cursor: 'sw-resize'});
			}
			if (angle >= 135 && angle < 225) {
				$resizeBR.attr('class', klass_tl).css({cursor: 'nw-resize'});
				$resizeBL.attr('class', klass_tr).css({cursor: 'ne-resize'});
				$resizeTL.attr('class', klass_br).css({cursor: 'se-resize'});
				$resizeTR.attr('class', klass_bl).css({cursor: 'sw-resize'});
			}
			if (angle >= 225 && angle < 315) {
				$resizeTR.attr('class', klass_tl).css({cursor: 'nw-resize'});
				$resizeBR.attr('class', klass_tr).css({cursor: 'ne-resize'});
				$resizeBL.attr('class', klass_br).css({cursor: 'se-resize'});
				$resizeTL.attr('class', klass_bl).css({cursor: 'sw-resize'});
			}
		}
	};
	return $style;
});
