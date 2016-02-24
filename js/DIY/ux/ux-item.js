define(['jquery','ux/jquery.common', 'ux/ux-style', 'ux/ux-bg', 'ux/ux-api', 'ux/ux-history'],function($,common, $style, $bg, api, history){
	var $item = {
		dragTarget: {
			targetId: null,
			targetSrc: null,
			targetHeight: null,
			targetWidth: null
		},
		init : function(){
			this.event();
			this.move.dragElementTemp = this.move.dragElement;
		},
		edge: {},
		showLoading: function() {
			$('.loading-remind').fadeIn();
		},
		hideLoading: function() {
			$('.loading-remind').fadeOut();
		},
		event : function(){
			common.event({
	        	obj : "#drag-bg ul li img.drag-bg",
				eventType : "click",
				fn : function($this,e){
					var item = $($this).clone();
					$item.showLoading();
					$item.unselect();
					$bg.createBackground({
						item : item
					}, function() {},function() {$item.hideLoading();});
				}
	        });
	        common.event({
				obj : "#drag-target .drag-item:not(.handler)",
				eventType : "mousedown",
				fn : function($this,e){
					
					if ($bg.isSelected) {
						return false;
					}
					
					$item.selected($this);
					
					$item.move.addMousemove($this,e);
				}
			});
			common.event({
				obj : "#drag-target .drag-item.handler",
				eventType : "mousedown",
				fn : function($this,e){
	        		// addMousemove(e,$this);
	        		var width = $($this).width();
	        		var height = $($this).height();
	        		var minNum = Math.min(width, height);
	        		var position = {};
	        		if(minNum >= height){
	        			position = {
	        				"top" : minNum >= height ? 0 : parseFloat(width)/2,
							"left" : minNum >= width ? 0 : parseFloat(height)/2
	        			};
	        		}
	        		$("#drag-target .drag-item.handler .measure-tool").css({
	        			"width" : minNum,
						"height" : minNum,
						"top" : 0,
						"left" : parseFloat(width-minNum)/2
	        		});

	        		var dragTarget = document.querySelector('#drag-target');
					$item.edge = {
						top: dragTarget.offsetTop,
						left: dragTarget.offsetLeft,
						right: dragTarget.offsetLeft + dragTarget.offsetWidth,
						bottom: dragTarget.offsetTop + dragTarget.offsetHeight
					};

	        		$item.move.addMousemove($this,e);
				}
			});
			$("#drag-bg").on({
				"dragstart" : function(e){
					// // console.log(e.target.id);
					$item.dragTarget.targetId = e.target.id;
					$item.dragTarget.targetHeight = e.target.clientHeight;
					$item.dragTarget.targetWidth = e.target.clientWidth;
				    // // console.log(e.originalEvent.dataTransfer.getData("drag"));
				},
				"dragenter" : function(){
					
				},
				// "dragover" : function(e){
				// 	e.preventDefault();
				// 	// console.log("dragover");
				// },
				"dragleave" : function(){
				},
				"dragend" : function(e){
					
				},
				"drag" : function(e){
				},
				"drop" : function(e){
					e.preventDefault();
				}
			});
			$(".drag-items").on({
				"dragstart" : function(e){
					if (/Firefox/g.test(window.navigator.userAgent)) {
						e.originalEvent.dataTransfer.setData('image/png', '');
						e.originalEvent.dataTransfer.dropEffect = "none";
					}
					
					$item.dragTarget.targetId = e.target.id;
					$item.dragTarget.targetSrc = e.target.getAttribute('data-src');
				    // // console.log(e.originalEvent.dataTransfer.getData("drag"));
				},
				"dragenter" : function(){

				},
				// "dragover" : function(e){
				// 	e.preventDefault();
				// 	// console.log("dragover");
				// },
				"dragleave" : function(){
				},
				"dragend" : function(e){
					
				},
				"drag" : function(e){
				},
				"drop" : function(e){
					e.preventDefault();
				}
			});
			$("#drag-target").on({
				"drag" : function(e){

				},
				"dragover" : function(e){
					e.preventDefault();
				},
				"drop" : function(e){
					e.preventDefault();
				    if (e.target.id == "drag-target" || $(e.target).parents("#drag-target")[0]) {
				    	
				    	var $target = $("#" + $item.dragTarget.targetId);
						if($target.attr("draggable") === "true"){
							var img = new Image();
							$item.showLoading();
				    		img.onload = function() {
				    			$item.hideLoading();
				    			var self = this;
				    			var targetItem = {
						    		id : $item.dragTarget.targetId,
						    		height : this.height,
						    		width : this.width
						    	};

							    var $targetContainer = $("#drag-target");
							    var targetTop = $targetContainer.offset().top;
							    var targetLeft = $targetContainer.offset().left;
							    var targetHeight = targetItem.height;
							   	var targetWidth = targetItem.width;
							    var offsetTop = e.originalEvent.clientY - targetTop - targetHeight / 2;
							    var offsetLeft = e.originalEvent.clientX - targetLeft - targetWidth / 2;
							    var targetItemLength = $("#drag-target .drag-item").length;
							    var $targetId = targetItem.id.replace("drag-item-", "");
							    /*隐藏drag-item,同步handler*/

							    var item = $target.clone().empty();
							    var json = {
							    	css : {
						    			"width" : targetWidth,
						    			"height" : targetHeight
						    		}
							    };
							    if($target.hasClass("drag-item")){
								    $bg.unselect();
							    	item.removeAttr("draggable").css({
								    	"transform" : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)",
						               	// "-webkit-transform" : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)",
								    	"top" : offsetTop,
								    	"left" : offsetLeft,
								    	"width" : targetWidth,
								    	"height" : targetHeight,
								    	"z-index": targetItemLength,
								    	"background-image": "url("+ self.src +")"
								    }).attr({
								    	"data-resoureid" : "drag-item-" + $targetId,
								    	"data-json": JSON.stringify(json),
								    	"id" : "drag-handler-" + common.getRandom(),
								    	"proId": $target.attr('data-proid')
								    });
								    $("#drag-target").append(item)
								    .find(".handler").attr({
								    	"style" : $(item).attr("style"),
								    	"data-resoureid" : "drag-item-" + $targetId,
								    	"data-handlerid" : item.attr('id'),
								    	"data-json" : JSON.stringify(json),
								    	"data-src": this.src
								    }).css("background", "none");
								    $style.resize.item();
								    $item.selected();
								    //获取角度图
								    api.getPerspectives({proid: item.attr('data-proid'), goods_id: item.attr('data-goodsid')}, function(html, detail, cropHtml) {
										$('#attrStyle .content').html(html);
										if (detail) {
											$('#prodectDetail').show().find('.content').html(detail);
										}
										$('.crop-option .views .content').html(cropHtml);
									});
								    history.push($('#drag-target').html());
								}else if($target.hasClass("drag-bg")){
									$item.unselect();
									$bg.createBackground({
										item : item
									}, function() {}, function() {$item.hideLoading();});
									history.push($('#drag-target').html());
								}
								$item.dragTarget.targetId = null;
								$item.dragTarget.targetHeight = null;
								$item.dragTarget.targetWidth = null;

								
							}
							img.onerror = function() {
								$item.hideLoading();
							}
							img.crossOrigin = '';
							img.src = $item.dragTarget.targetSrc;
				    	};
				    	
				    }
				}
			});
			common.event({
				obj: '.add-to-canvas',
				eventType: 'click',
				fn: function($this) {
					var targetId = $($this).attr('data-id'),
						$target = $('#' + targetId);

					var img = new Image();
					$item.showLoading();
		    		img.onload = function() {
		    			$item.hideLoading();
		    			var self = this;

					    var $targetContainer = $("#drag-target");
					    var targetTop = $targetContainer.offset().top;
					    var targetLeft = $targetContainer.offset().left;
					    var targetHeight = this.height;
					   	var targetWidth = this.width;
					    var targetItemLength = $("#drag-target .drag-item").length;
					    /*隐藏drag-item,同步handler*/

					    var item = $target.clone().empty();
					    var json = {
					    	css : {
				    			"width" : targetWidth,
				    			"height" : targetHeight
				    		}
					    };
					    if($target.hasClass("drag-item")){
						    $bg.unselect();
					    	item.removeAttr("draggable").css({
						    	"transform" : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)",
				               	// "-webkit-transform" : "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)",
						    	"top" : 0,
						    	"left" : 0,
						    	"width" : targetWidth,
						    	"height" : targetHeight,
						    	"z-index": targetItemLength,
						    	"background-image": "url("+ self.src +")"
						    }).attr({
						    	"data-resoureid" : "drag-item-" + targetId,
						    	"data-json": JSON.stringify(json),
						    	"id" : "drag-handler-" + common.getRandom(),
						    	"proId": $target.attr('data-proid')
						    });
						    $("#drag-target").append(item)
						    .find(".handler").attr({
						    	"style" : $(item).attr("style"),
						    	"data-resoureid" : "drag-item-" + targetId,
						    	"data-handlerid" : item.attr('id'),
						    	"data-json" : JSON.stringify(json),
						    	"data-src": this.src
						    }).css("background", "none");
						    $style.resize.item();
						    $item.selected();
						    //获取角度图
						    api.getPerspectives({proid: item.attr('data-proid'), goods_id: item.attr('data-goodsid')}, function(html, detail, cropHtml) {
								$('#attrStyle .content').html(html);
								if (detail) {
									$('#prodectDetail').show().find('.content').html(detail);
								}
								$('.crop-option .views .content').html(cropHtml);
							});
						    history.push($('#drag-target').html());
						}
					}
					img.onerror = function() {
						$item.hideLoading();
					}
					img.crossOrigin = '';
					img.src = $target.attr('data-src');
				}
			});
			//缩放，旋转
			common.event({
				obj : "#handler .resize, #handler .z .point",
				eventType : "mousedown",
				fn : function($this,e){
					$item.move.val.dragable = true;
					$item.move.disable();
					// $("#handler").unbind("mousedown");
					var $ele = $($this);
					var addResizemove = $style.resize.addResizemove;
					if($ele.hasClass("nw")){
						addResizemove($this,e,"nw");
					}else if($ele.hasClass("ne")){
						addResizemove($this,e,"ne");
					}else if($ele.hasClass("se")){
						addResizemove($this,e,"se");
					}else if($ele.hasClass("sw")){
						addResizemove($this,e,"sw");
					}else if($ele.hasClass("point")){
						addResizemove($this,e,"z");
					}
				}
			});
			common.event({
				obj : document,
				eventType : "mouseup",
				fn : function($this,e){
					if ($item.move.val.dragable) {
						history.push($('#drag-target').html());
					}
			       	$($this).unbind('mousemove');
			       	if ((($(e.target).attr('id') && $(e.target).attr('id') == 'drag-target') || $(e.target).hasClass('drag-bg')) && !$item.move.val.dragable) {
			       		$item.unselect();
			       		$bg.unselect();
			       	}
			       	$item.move.enable();
					$item.move.val.dragable = false;
			    }
			});
			//点击切换角度图
			$('#attrStyle').on('click', '.drag-item', function(e) {
				var src = $(this).attr('data-src'),
					id = $(this).attr('id');
				$item.choosePerspective(src, id);
			});
		},
		choosePerspective: function(imgSrc, id) {
			var img = new Image();
    		img.onload = function() {
    			var width = this.width,
    				height = this.height;
    			
			    var radio = width / height, w, h;
			    
    			var $handler = $('#handler'),
    				$target = $('#' + $handler.attr('data-handlerid'));

				if ($handler.width() > $handler.height()) {
			    	w = $handler.width();
			    	h = w / radio;
			    } else {
			    	h = $handler.height();
			    	w = h * radio;
			    }

			    var json = {
			    	css : {
		    			"width" : w,
		    			"height" : h
		    		}
			    };
				$handler.attr({
					'data-json' : JSON.stringify(json),
					'data-src': imgSrc,
					'data-handlerid': id
				}).css({
					width: w + 'px',
					height: h + 'px'
				});
				$target.attr({
					'id': id, //替换新id
					'data-src': imgSrc,
					'data-json': JSON.stringify(json)
				}).css({
					'background-image': 'url('+ imgSrc +')',
					width: w + 'px',
					height: h + 'px'
				});
    		};
    		img.src = imgSrc;
		},
		selected : function($this){
			var $this = $($this);
			if($this){
				var resoureid = $this.attr("data-resoureid"),
					handlerid = $this.attr("id"),
					imgSrc = $this.attr('data-src'),
					$handler = $('#handler');
				$handler.attr({
					"style" : $this.attr("style"),
			    	"data-resoureid": resoureid,
			    	"data-handlerid": handlerid,
			    	"data-src": imgSrc
				}).css({
					"display": "block",
					"z-index" : 998,
					"background" : "none"
				});
				

				$style.resize.item();

				if (!$this.hasClass('drag-bg')) {
					$handler.find('.z').css('display', 'block');
				}
				if (handlerid) {
					api.getPerspectives({proid:$('#' + handlerid).attr('data-proid'), goods_id: $('#' + handlerid).attr('data-goodsid')}, function(html, detail, cropHtml) {
						$('#attrStyle .content').html(html);
						if (detail) {
							$('#prodectDetail').show().find('.content').html(detail);
						}
						$('.crop-option .views .content').html(cropHtml);
					});
				}
				
			}
			if ($('#handler').attr('data-handlerid')) {
				$("#handler").show();
				$('#attr').find('button,input').not($('#resizeW')[0]).not($('#resizeH')[0]).removeAttr('disabled');
				$("#attrResize").addClass("active");
				var target = document.querySelector('#' + $('#handler').attr('data-handlerid'));

				var reg = /rotateZ\([\+\-]?(\d*.?\d*)deg\)/;
				var result = $('#handler').attr('style').match(reg);
				if (result && result[1]) {
					$style.rebuildHandler(result[1]);
				}
			}
			
		},
		unselect : function(){
			$('#attr').find('button,input').attr('disabled', 'true');
			$('#prodectDetail').hide().find('.content').empty();
			$('#attrStyle .content').empty();
			$("#attrResize").removeClass("active");
			$('#handler').removeAttr('data-handlerid');
		},
		move : {
			val : {
				dragable : false
			},
			addMousemove : function($this,e){
	        	$item.move.val.dragable = true;
	            var offset = $($this).offset();
	            divLeft = parseFloat(offset.left);
	            divTop = parseFloat(offset.top);
	            mousey = e.pageY;
	            mousex = e.pageX;
	            $(document).bind('mousemove',$item.move.dragElement);
			},
			dragElement : function(event){
	        	if($item.move.val.dragable || $($('#handler').attr('data-handlerid')).hasClass('.drag-bg')) {
	        		
	        		var handler = document.querySelector('#handler'),
	        			style = handler.style, 
	        			top = null, 
	        			left = null;
	        		var point = {
	        			pageX: event.pageX - mousex,
	        			pageY: event.pageY - mousey
	        		};
	        		
	        		if (handler.offsetLeft + point.pageX >= - handler.offsetWidth && 
						(handler.offsetLeft + handler.offsetWidth) + $item.edge.left + point.pageX <= $item.edge.right + handler.offsetWidth) {
						left = handler.offsetLeft + (event.pageX - mousex) + 'px';
					}
					if (handler.offsetTop + point.pageY >= -handler.offsetHeight &&
						handler.offsetTop + handler.offsetHeight + point.pageY + $item.edge.top <= $item.edge.bottom + handler.offsetHeight) {
						top = handler.offsetTop + (event.pageY - mousey) + 'px';
					}

	            	var target = document.querySelector('#' + handler.getAttribute('data-handlerid'));
	        		if (left) {
	        			handler.style.left = left;
	        			target.style.left = left;
	        		}
	            	if (top) {
	            		handler.style.top = top;
		            	target.style.top = top;
	            	}
	            	
		            mousex = event.pageX;
		            mousey = event.pageY;
		            return false;
	        	}          
	        },
	        dragElementTemp : function(){
	        	return null;
	        },
			enable : function(){
				$item.move.dragElement = $item.move.dragElementTemp;
			},
			disable : function(){
				// $item.move.dragElementTemp = $item.move.dragElement;
				$item.move.dragElement = function(){return false;}
			}
		},
		center : function(options){
			var $ele = options.ele;
			// var $item = options.
			var leftNums = [],
				topNums = [],
				rightNums = [],
				bottomNums = [];
			var $target = $("#drag-target"),
				targetWidth = $target.width(),
				targetHeight = $target.height(),
				targetTop = $target.offset().top,
				targetBottom = targetTop + targetHeight,
				targetLeft = $target.offset().left,
				targetRight = targetLeft + targetWidth;
				
			$($ele).each(function(){
				leftNums.push($(this).offset().left);
				topNums.push($(this).offset().top);
				rightNums.push($(this).offset().left + $(this).width());
				bottomNums.push($(this).offset().top + $(this).height());
			});
			var minX = Math.min.apply(Math, leftNums);
			var maxX = Math.max.apply(Math, rightNums);
			var minY = Math.min.apply(Math, topNums);
			var maxY = Math.max.apply(Math, bottomNums);
			
			var centerWidth = maxX - minX;
			var centerHeight = maxY - minY;
			var centerLeft = (targetWidth-centerWidth)/2;
			var centerTop = (targetHeight-centerHeight)/2;
			var resultLeft = minX-centerLeft;
			var resultTop = minY-centerTop;
			return {
				left : resultLeft,
				top : resultTop
			}
		}
	};
	return $item;
});
