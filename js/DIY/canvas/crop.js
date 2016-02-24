define(['canvas/util'],function(util){


	function Crop(parent) {
		this.croper = null;
		this.scale = false;
		this.MIN_WIDTH = 20;
		this.TOLERANCE = 3;
		this.CROP_IMAGE = 'cropImage';
		this.CROP_IMAGE_WIDTH = 'cropImageWidth';
		this.CROP_IMAGE_HEIGHT = 'cropImageHeight';
		this.currentNode = '';
		this.paths = [];
		this.currentPoint = {
			pageX: '',
			pageY: ''
		};
		this.operationClass = 'crop-operation';
		this.parent = parent;
		this.currentWidth = '';
		this.currentHeight = '';
		this.init(parent);
		this.genMask();
	}

	Crop.prototype.init = function(parent) {
		var slef = this;
		var fragment = document.createDocumentFragment(),
			croper = document.createElement('DIV');
		croper.className = 'croper';
		croper.style.display = 'none';

		for (var i = 1; i < 9; i++) {
			var f = document.createElement('DIV'),
				fl = document.createElement('DIV');
			f.className = 'cp-node cp-node-' + i;
			fl.className = 'cp-line cp-line-' + i;
			croper.appendChild(f);
			croper.appendChild(fl);
		}
		this.croper = croper;
		if (parent) {
			parent.appendChild(croper);
		} else {
			document.body.appendChild(croper);
		}
		return croper;
	};

	Crop.prototype.reset = function(img, width, height) {
		var self = this;
		if (img.src) {
			localStorage.setItem(self.CROP_IMAGE, img.src);
			localStorage.setItem(self.CROP_IMAGE_WIDTH, img.width);
			localStorage.setItem(self.CROP_IMAGE_HEIGHT, img.height);
		} else {
			localStorage.setItem(self.CROP_IMAGE, img);
			localStorage.setItem(self.CROP_IMAGE_WIDTH, width);
			localStorage.setItem(self.CROP_IMAGE_HEIGHT, height);
		}
		
	};

	Crop.prototype.genMask = function() {
		var mask = document.createElement('DIV');
		var style = mask.style;
		style.position = 'absolute';
		style.height = '100%';
		style.top = '0px';
		style.left = '0px';
		style.right = '0px';
		style.bottom - '0px';
		style.background = '#000';
		style.opacity = '0.5';
		style.zIndex = 9998;
		style.display = 'none';
		this.parent.appendChild(mask);
		this.mask = mask;
		return mask;
	};

	Crop.prototype.onmousedown = function(e) {
		var self = this;
		if (util.DOM.cssjs('check', e.target, 'cp-node')) {
			self.currentNode = e.target.className.split(' ')[1];
			self.currentPoint = {
				pageX: e.pageX,
				pageY: e.pageY
			};
			self.currentWidth = self.croper.offsetWidth;
			self.currentHeight = self.croper.offsetHeight;
			self.scale = true;
			self.parentOffsetLeft = util.DOM.getElementViewLeft(self.parent);
			self.parentOffsetTop = util.DOM.getElementViewTop(self.parent);

			self.edge = {
				top: (self.parent.offsetHeight - self.imgHeight) / 2 - self.TOLERANCE,
				left: (self.parent.offsetWidth - self.imgWidth) / 2 - self.TOLERANCE,
				right: (self.parent.offsetWidth + self.imgWidth) / 2 + self.TOLERANCE,
				bottom: (self.parent.offsetHeight + self.imgHeight) / 2 + self.TOLERANCE
			};
		} else if (util.DOM.cssjs('check', e.target, 'croper')){
			self.move = true;
			self.currentPoint = {
				pageX: e.pageX,
				pageY: e.pageY
			};
			self.scale = false;
			self.parentOffsetLeft = util.DOM.getElementViewLeft(self.parent);
			self.parentOffsetTop = util.DOM.getElementViewTop(self.parent);

			self.edge = {
				top: (self.parent.offsetHeight - self.imgHeight) / 2,
				left: (self.parent.offsetWidth - self.imgWidth) / 2,
				right: (self.parent.offsetWidth + self.imgWidth) / 2,
				bottom: (self.parent.offsetHeight + self.imgHeight) / 2
			};
		} else {
			self.scale = false;
		}
	};

	Crop.prototype.onmousemove = function(e) {
		var self = this;
		var klass = self.currentNode;
		var style = self.croper.style;

		
		if (self.scale && klass) {
			var point = {
				pageX: e.pageX - self.currentPoint.pageX,
				pageY: e.pageY - self.currentPoint.pageY
			};
			/**边界处理*/
			if ((e.pageX - self.parentOffsetLeft) > self.edge.left && (e.pageX - self.parentOffsetLeft) < self.edge.right &&
						(e.pageY - self.parentOffsetTop) > self.edge.top && (e.pageY - self.parentOffsetTop) < self.edge.bottom) {
				switch(klass) {
					case 'cp-node-1': 
						/*if (point.pageX < (self.currentWidth - self.MIN_WIDTH) && 
							point.pageY < (self.currentHeight - self.MIN_WIDTH)) {*/
							style.width = Math.abs(self.currentWidth - point.pageX) + 'px';
							style.height = Math.abs(self.currentHeight - point.pageY) + 'px';
							style.left = e.pageX - self.parentOffsetLeft + 'px';
							style.top = e.pageY - self.parentOffsetTop + 'px';
						//}
						break;
					case 'cp-node-2':
						/*if (Math.abs(point.pageX) < (self.currentWidth - self.MIN_WIDTH) && 
							Math.abs(point.pageY) < (self.currentHeight - self.MIN_WIDTH)) {*/
							style.top = e.pageY - self.parentOffsetTop + 'px';
							style.width = Math.abs(self.currentWidth + point.pageX) + 'px';
							style.height = Math.abs(self.currentHeight - point.pageY) + 'px';	
						//}					
						break;
					case 'cp-node-3':
						/*if (Math.abs(point.pageX) < (self.currentWidth - self.MIN_WIDTH) && 
							Math.abs(point.pageY) < (self.currentHeight - self.MIN_WIDTH)) {*/
							style.width = Math.abs(self.currentWidth + point.pageX) + 'px';
							style.height = Math.abs(self.currentHeight + point.pageY) + 'px';
						//}
						break;
					case 'cp-node-4':
						/*if (point.pageX < (self.currentWidth - self.MIN_WIDTH) && 
							Math.abs(point.pageY) < (self.currentHeight - self.MIN_WIDTH)) {*/
							style.left = e.pageX - self.parentOffsetLeft + 'px';
							style.width = Math.abs(self.currentWidth - point.pageX) + 'px';
							style.height = Math.abs(self.currentHeight + point.pageY) + 'px';
						//}
						break;
					case 'cp-node-5':
						//if (point.pageY < (self.currentHeight - self.MIN_WIDTH)) {
							style.top = e.pageY - self.parentOffsetTop + 'px';
							style.height = Math.abs(self.currentHeight - point.pageY) + 'px';
						//}
						break;
					case 'cp-node-6':
						//if (Math.abs(point.pageX) < (self.currentWidth - self.MIN_WIDTH)) {
							style.width = Math.abs(self.currentWidth + point.pageX) + 'px';
						//}					
						break;
					case 'cp-node-7':
						//if (Math.abs(point.pageY) < (self.currentHeight - self.MIN_WIDTH)) {
							style.height = Math.abs(self.currentHeight + point.pageY) + 'px';
						//}
						break;
					case 'cp-node-8':
						//if (Math.abs(point.pageX) < (self.currentWidth - self.MIN_WIDTH)) {
							style.left = e.pageX - self.parentOffsetLeft + 'px';
							style.width = Math.abs(self.currentWidth - point.pageX) + 'px';
						//}
						break;
				}
				self.calculation();
			}
			
		}

		if (self.move) {
			var point = {
				pageX: e.pageX - self.currentPoint.pageX,
				pageY: e.pageY - self.currentPoint.pageY
			};
			if (self.croper.offsetLeft + point.pageX >= (self.edge.left - self.TOLERANCE) && 
				(self.croper.offsetLeft + self.croper.offsetWidth) + point.pageX <= (self.edge.right + self.TOLERANCE)) {
				style.left = self.croper.offsetLeft  + point.pageX + 'px';
			}
			if (self.croper.offsetTop + point.pageY >= (self.edge.top - self.TOLERANCE) &&
				self.croper.offsetTop + self.croper.offsetHeight + point.pageY <= (self.edge.bottom + self.TOLERANCE)) {
				style.top = self.croper.offsetTop + point.pageY + 'px';
			}
			self.currentPoint = {
				pageX: e.pageX,
				pageY: e.pageY
			};
			self.calculation();
			/*if ((self.croper.offsetLeft + point.pageX >= (self.edge.left - self.TOLERANCE) && 
				(self.croper.offsetLeft + self.croper.offsetWidth) + point.pageX <= (self.edge.right + self.TOLERANCE)) &&
				(self.croper.offsetTop + point.pageY >= (self.edge.top - self.TOLERANCE) && 
				(self.croper.offsetTop + self.croper.offsetHeight) + point.pageY <= (self.edge.bottom + self.TOLERANCE))) {
				style.left = self.croper.offsetLeft  + point.pageX + 'px';
				style.top = self.croper.offsetTop + point.pageY + 'px';
				self.currentPoint = {
					pageX: e.pageX,
					pageY: e.pageY
				};
				self.calculation();
			}*/
			
		}
	};

	Crop.prototype.onmouseup = function(e) {
		var self = this;
		self.scale = false;
		self.move = false;
		self.currentNode = '';
	};

	Crop.prototype.show = function() {
		var self = this;
		var style = self.croper.style;
		style.display = 'block';
		style.top = (self.parent.offsetHeight - 100) / 2 + 'px';
		style.left = (self.parent.offsetWidth - 100) /2 + 'px';
		style.width = '100px';
		style.height = '100px';
		self.mask.style.display = 'block';
		//document.querySelector('.' + self.operationClass).style.display = 'block';
		self.img = localStorage.getItem(self.CROP_IMAGE);
		self.imgWidth = parseInt(localStorage.getItem(self.CROP_IMAGE_WIDTH));
		self.imgHeight = parseInt(localStorage.getItem(self.CROP_IMAGE_HEIGHT));
		self.croper.style.background = 'url("' + self.img + '") center center no-repeat';

		if (self.parent) {
			var scaleW = self.imgWidth, scaleH = self.imgHeight;
            if (self.imgWidth / self.imgHeight > self.parent.offsetWidth / self.parent.offsetHeight && self.imgWidth > self.parent.offsetWidth) {
                scaleW = self.parent.offsetWidth;
                scaleH = self.imgHeight * scaleW / self.imgWidth;
            }
            if (self.imgWidth / self.imgHeight < self.parent.offsetWidth / self.parent.offsetHeight && self.imgHeight > self.parent.offsetHeight) {
                scaleH = self.parent.offsetHeight;
                scaleW = self.imgWidth * scaleH / self.imgHeight;
            }
            self.imgWidth = scaleW;
            self.imgHeight = scaleH;
            self.croper.style['background-size'] = scaleW + 'px ' + scaleH + 'px';
		}
		
	};

	Crop.prototype.calculation = function(e) {
		var self = this, croper = self.croper;
		var hw = self.parent.offsetWidth,
			hh = self.parent.offsetHeight,
			ht = croper.offsetTop,
			hl = croper.offsetLeft;
			px = (((hw - self.imgWidth) / 2) - hl - 1) + 'px';
			py = (((hh - self.imgHeight) / 2) - ht - 1) + 'px';

		croper.style.backgroundPosition = px + ' ' + py;
	};

	Crop.prototype.hide = function() {
		this.croper.style.display = 'none';
		this.mask.style.display = 'none';
		//document.querySelector('.' + this.operationClass).style.display = 'none';
	};

	Crop.prototype.getPaths = function() {
		var self = this, croper = self.croper;
		self.paths = [];
		for (var i = 1, j = 5; i < j; i++) {
			var point = croper.querySelector('.cp-node-' + i);
			var obj = {
				x: util.DOM.getElementViewLeft(point) - util.DOM.getElementViewLeft(self.parent) + 4,
				y: util.DOM.getElementViewTop(point) - util.DOM.getElementViewTop(self.parent) + 4
			};
			self.paths.push(obj);
		}
		return self.paths;
	};

	Crop.prototype.deactive = function() {
		var self = this;
		self.croper.removeEventListener('mousedown', listeners.mousedown, false);
        document.removeEventListener('mousemove', listeners.mousemove, false);
        document.removeEventListener('mouseup', listeners.mouseup, false);
        self.hide();
	};

	Crop.prototype.active = function() {
		var self = this;
        listeners = {
            mousedown: function(e){self.onmousedown(e);},
            mousemove: function(e){self.onmousemove(e);},
            mouseup: function(e){self.onmouseup(e);}
        };

        util.DOM.cssjs('remove', self.croper, 'hidden');

        self.croper.addEventListener('mousedown', listeners.mousedown, false);
        document.addEventListener('mousemove', listeners.mousemove, false);
        document.addEventListener('mouseup', listeners.mouseup, false);
        self.show();
	};

	

	return new Crop(document.querySelector('.pasteBoard'));
});