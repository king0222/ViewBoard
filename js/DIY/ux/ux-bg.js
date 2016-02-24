define(['jquery','ux/jquery.common', 'ux/ux-style'],function($, common, $style){
	var $bg = {
		init : function(){
		},
		isSelected: false,
		selected : function(){
			var handler = document.querySelector('#handler'),
				bg = document.querySelector('#drag-target img');
			if (!bg) {
				return false;
			}
			handler.querySelector('.z').style.display = 'none';
			var width = bg.width,
				height = bg.height;
			var json = {
				css : {
	    			"width" : width,
	    			"height" : height
	    		}
			};
			handler.setAttribute('data-json', JSON.stringify(json));
			handler.setAttribute('data-handlerid', bg.getAttribute('id'));
			handler.style.width = width + 'px';
			handler.style.height = height + 'px';
			handler.style.top = bg.offsetTop + 'px',
			handler.style.left = bg.offsetLeft + 'px';
			handler.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)';
			handler.style.display = 'block';
			handler.style.background = 'rgba(255, 255, 255, 0.1)';

			document.querySelector('.bg-tools .unlock').style.display = 'none';
			document.querySelector('.bg-tools .lock').style.display = 'inline-block';

			$style.rebuildHandler(0);
			$bg.isSelected = true;
		},
		unselect : function(){
			var handler = document.querySelector('#handler');
			handler.querySelector('.z').style.display = 'block';
			document.querySelector('.bg-tools .unlock').style.display = 'inline-block';
			document.querySelector('.bg-tools .lock').style.display = 'none';
			
			handler.style.display = 'none';
			handler.setAttribute('data-handlerid', '');
			handler.setAttribute('data-resoureidid', '');
			document.querySelector('.bg-tools .unlock').style.display = 'inline-block';
			document.querySelector('.bg-tools .lock').style.display = 'none';

			$bg.isSelected = false;
		},
		showTools: function() {
			document.querySelector('.bg-tools').style.display = 'inline-block';
		},
		hideTools: function() {
			document.querySelector('.bg-tools').style.display = 'none';
		},
		fullscreenBackground: function(options) {
			$bg.createBackground(options, function() {
				$bg.selected();
			});
			
		},
		createBackground : function(options, callback, hideloading){
			var $targetContainer = $("#drag-target");
			var item = options.item;

			var src = item.attr('data-src');
			var img = new Image();
			img.onload = function() {
				if (hideloading) {
					hideloading();
				}
				var bgWidth = this.width;
				var bgHeight = this.height;
				// var max = Math.max(bg.clientWidth, bg.clientHeight);
				var maxWidth, maxHeight;
				if($targetContainer.width() / $targetContainer.height() > bgWidth / bgHeight){
					maxHeight = $targetContainer.height();
					maxWidth = bgWidth * maxHeight / bgHeight;
				}else{
					maxWidth = $targetContainer.width();
					maxHeight = bgHeight * maxWidth / bgWidth;
				}
				var handlerid = 'drag-handler-' + item.attr('id'),
					json = {
						css: {
							width: bgWidth,
							height: bgHeight
						}
					};
				item.removeAttr('draggable').css({
			    	'width' : maxWidth,
			    	'height' : maxHeight,
			    	'top': 0,
			    	'left': ($targetContainer.width() - maxWidth) / 2 + 'px'
				}).attr({
					'src': item.attr('data-src'),
					'id': handlerid,
					'data-json': JSON.stringify(json)
				});
				$('#handler').attr({
					'data-handlerid': handlerid
				}).css({
					'display': 'none',
					'background': 'rgba(255, 255, 255, 0.1)',
					'z-index': 998
				});
				var $bgImg = $targetContainer.find(".drag-bg");
				if($bgImg[0]){
					$bgImg.remove();
				}
				// // console.log($targetContainer);
				$targetContainer.append(item);
				$bg.showTools();

				if (callback) {
					callback();
				}
			};
			img.onerror = function() {
				if (hideloading) {
					hideloading();
				}
			}
			img.src = src;
			
		}
	};
	return $bg;
});
