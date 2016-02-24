define([], function() {

    function Merge(options) {
        this.width = (options && options.width) || 0;
        this.height = (options && options.height) || 0;
        this.images = [];
        this.init();
    }

    Merge.prototype.init = function() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    Merge.prototype.resize = function(width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * 核心方法
     * @param  {[type]} options [参数集中为obj对象,包含5个参数]
     * scale, top, left, rotate, img
     * merge.merge({img:})
     * @return {[type]}         [返回canvas]
     */
    /*Merge.prototype.merge = function(width, height, options) {
        var self = this;
        if (arguments.length === 1) {
            options = width;
        } else {
            self.canvas.width = width;
            self.canvas.height = height;
        }
        if (!options) {
            return false;
        }
        self.mergeNum = options.length;
        self.images = [];
        for (var i = 0, j = options.length; i < j; i++) {
            if (typeof(options[i].img) === 'object') {
                self.images.push(options[i].img);
                self.drawImage(options[i]);
            } else {
                (function(i) {
                    var newImg = new Image();
                    newImg.onload = function() {
                        self.images.push(this);
                        options[i].img = this;
                        self.drawImage(options[i]);
                    };
                    newImg.crossOrigin = '';
                    newImg.src = options[i].img;
                })(i);
            }
        }
    }*/
    Merge.prototype.merge = function(width, height, options) {
        var self = this;
        if (arguments.length === 1) {
            options = width;
        } else {
            self.canvas.width = width;
            self.canvas.height = height;
        }
        if (!options) {
            return false;
        }
        self.mergeNum = options.length;
        self.images = [];
        var context = self.context;
        for (var i = 0, j = options.length; i < j; i++) {
            if (typeof(options[i].img) === 'object') {
                var op = options[i];
                (function(op) {
                    context.save();
                var img = op.img;
                if (op.flip == -1 || op.flop == -1) {
                    var result = null;
                    if (op.flip == -1) {
                        result = self.getFlipData(img);
                    }
                    if (op.flop == -1) {
                        if (result) {
                            var newImg = new Image();
                            newImg.src = result;
                            newImg.onload = function() {
                                result = self.getFlopData(this);
                                var flopImg = new Image();
                                flopImg.src = result;
                                flopImg.onload = function() {
                                    self.images.push(this);
                                    context.translate(op.left + (op.width / 2), op.top + (op.height / 2));
                                    context.rotate(op.rotate * Math.PI / 180);
                                    context.translate(-(op.left + (op.width / 2)), -(op.top + (op.height / 2)));
                                    context.drawImage(this, 0, 0, img.width, img.height, op.left, op.top, op.width, op.height);
                                    context.restore();
                                    if (self.images.length == self.mergeNum) {
                                        self.saveImage();
                                    }
                                }
                            }
                        } else {
                            result = self.getFlopData(img);
                            var flopImg = new Image();
                            flopImg.src = result;
                            flopImg.onload = function() {
                                self.images.push(this);
                                context.translate(op.left + (op.width / 2), op.top + (op.height / 2));
                                context.rotate(op.rotate * Math.PI / 180);
                                context.translate(-(op.left + (op.width / 2)), -(op.top + (op.height / 2)));
                                context.drawImage(this, 0, 0, img.width, img.height, op.left, op.top, op.width, op.height);
                                context.restore();
                                if (self.images.length == self.mergeNum) {
                                    self.saveImage();
                                }
                            }
                        }
                        
                    } else {
                        var newImg = new Image();
                        newImg.src = result;
                        newImg.onload = function() {
                            self.images.push(this);
                            context.translate(op.left + (op.width / 2), op.top + (op.height / 2));
                            context.rotate(op.rotate * Math.PI / 180);
                            context.translate(-(op.left + (op.width / 2)), -(op.top + (op.height / 2)));
                            context.drawImage(this, 0, 0, img.width, img.height, op.left, op.top, op.width, op.height);
                            context.restore();
                            if (self.images.length == self.mergeNum) {
                                self.saveImage();
                            }
                        }
                    }
                    
                } else {
                    self.images.push(op.img);
                    context.translate(op.left + (op.width / 2), op.top + (op.height / 2));
                    context.rotate(op.rotate * Math.PI / 180);
                    context.translate(-(op.left + (op.width / 2)), -(op.top + (op.height / 2)));
                    context.drawImage(img, 0, 0, img.width, img.height, op.left, op.top, op.width, op.height);
                    context.restore();
                    if (self.images.length == self.mergeNum) {
                        self.saveImage();
                    }
                }
                })(op);
                
            }
        }
    }

    Merge.prototype.drawImage = function(options) {
        var self = this,
            context = self.context;
        context.save();
        context.translate(options.left + (options.width / 2), options.top + (options.height / 2));
        context.rotate(options.rotate * Math.PI / 180);
        context.translate(-(options.left + (options.width / 2)), -(options.top + (options.height / 2)));
        var img = options.img;
        context.drawImage(img, 0, 0, img.width, img.height, options.left, options.top, options.width, options.height);
        context.restore();
        if (self.images.length == self.mergeNum) {
            self.saveImage();
        }
    }

    Merge.prototype.saveImage = function() {
        var self = this,
            type = "png";
        var dataURL = self.canvas.toDataURL();
        var filename = 'fashome_' + (new Date()).getTime() + '.' + type;
        if (self.canvas.msToBlob) { //for IE
            var blob = self.canvas.msToBlob();
            window.navigator.msSaveBlob(blob, filename);
        } else {
            saveFile(dataURL, filename);
        }


        function saveFile(data, filename) {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;

            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        };
    }

    Merge.prototype.genComposite = function(width, height, options, callback) {
        var self = this;
        if (arguments.length === 1) {
            options = width;
        } else {
            self.canvas.width = width;
            self.canvas.height = height;
        }
        if (!options) {
            return false;
        }
        self.mergeNum = options.length;
        self.images = [];
        var context = self.context;
        for (var i = 0, j = options.length; i < j; i++) {
            if (typeof(options[i].img) === 'object') {
                var op = options[i];
                (function(op) {
                    context.save();
                var img = op.img;
                if (op.flip == -1 || op.flop == -1) {
                    var result = null;
                    if (op.flip == -1 && op.flop != -1) {
                        result = self.getFlipData(img);
                    }
                    if (op.flip != -1 && op.flop == -1) {
                        result = self.getFlopData(img);
                    }
                    if (op.flip == -1 && op.flop == -1) {
                        result = self.getFlipFlopData(img);
                    }
                    self.images.push(result);
                    context.translate(op.left + (op.width / 2), op.top + (op.height / 2));
                    context.rotate(op.rotate * Math.PI / 180);
                    context.translate(-(op.left + (op.width / 2)), -(op.top + (op.height / 2)));
                    context.drawImage(result, 0, 0, img.width, img.height, op.left, op.top, op.width, op.height);
                    context.restore();
                    if (self.images.length == self.mergeNum) {
                        callback(self.canvas);
                    }
                    /*var newImg = new Image();
                    newImg.src = result;
                    newImg.onload = function() {
                        self.images.push(this);
                        context.translate(op.left + (op.width / 2), op.top + (op.height / 2));
                        context.rotate(op.rotate * Math.PI / 180);
                        context.translate(-(op.left + (op.width / 2)), -(op.top + (op.height / 2)));
                        context.drawImage(this, 0, 0, img.width, img.height, op.left, op.top, op.width, op.height);
                        context.restore();
                        if (self.images.length == self.mergeNum) {
                            callback(self.canvas);
                        }
                    }*/
                    
                } else {
                    self.images.push(op.img);
                    context.translate(op.left + (op.width / 2), op.top + (op.height / 2));
                    context.rotate(op.rotate * Math.PI / 180);
                    context.translate(-(op.left + (op.width / 2)), -(op.top + (op.height / 2)));
                    context.drawImage(img, 0, 0, img.width, img.height, op.left, op.top, op.width, op.height);
                    context.restore();
                    if (self.images.length == self.mergeNum) {
                        callback(self.canvas);
                    }
                }
                })(op);
                
            }
        }
    }

    Merge.prototype.getFlipData = function(img, callback) {
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
        canvas.width = img.width,
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        var imgData = context.getImageData(0, 0, img.width, img.height),
        x, y, p, i, i2, t,
        h = img.height,
        w = img.width,
        w_2 = w / 2;
        // 将 imgData 的数据水平翻转
        for (y = 0; y < h; y ++) {
            for (x = 0; x < w_2; x ++) {
                i = (y<<2) * w + (x<<2);
                i2 = ((y + 1) << 2) * w - ((x + 1) << 2);
                for (p = 0; p < 4; p ++) {
                    t = imgData.data[i + p];
                    imgData.data[i + p] = imgData.data[i2 + p];
                    imgData.data[i2 + p] = t;
                }
            }
        }
        context.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
        return canvas;
    }

    Merge.prototype.getFlopData = function(img) {
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
        canvas.width = img.width,
        canvas.height = img.height;
        context.translate(0, img.height);
        context.scale(1, -1);
        context.drawImage(img, 0, 0, img.width, img.height);
        
        return canvas;
    }

    Merge.prototype.getFlipFlopData = function(img) {
        var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
        canvas.width = img.width,
        canvas.height = img.height;
        context.translate(img.width, img.height);
        context.scale(-1, -1);
        context.drawImage(img, 0, 0, img.width, img.height);
        return canvas;
    }
    /*Merge.prototype.saveAs = function() {
    	function saveImage(blob) {
            var a = document.createElement('a');
	        a.href = window.URL.createObjectURL(blob);
	        a.download = 'fashome_' + (new Date()).getTime() + '.png';
	        a.textContent = '';
	        document.body.appendChild(a);
	        a.onclick = function() {
	        	downLoadImage(a.download);
	        	return false;
	        }
	        a.click();
        }

        this.canvas.toBlob(saveImage);
    }

    function downLoadImage(imagePathURL) {
        //如果中间IFRAME不存在，则添加
        if (!document.getElementById("_SAVEASIMAGE_TEMP_FRAME")) {
            var iframe = document.createElement('iframe');
            iframe.setAttribute('style', 'display:none;');
            iframe.setAttribute('id', '_SAVEASIMAGE_TEMP_FRAME');
            iframe.setAttribute('name', '_SAVEASIMAGE_TEMP_FRAME');
            iframe.setAttribute('src', 'about:blank');
            document.body.appendChild(iframe);
        }
        if (document.all._SAVEASIMAGE_TEMP_FRAME.src != imagePathURL) {
            //图片地址发生变化，加载图片
            document.all._SAVEASIMAGE_TEMP_FRAME.src = imagePathURL;
            _doSaveAsImage();
        } else {
            //图片地址没有变化，直接另存为
            _doSaveAsImage();
        }
    }

    function _doSaveAsImage() {
        if (document.all._SAVEASIMAGE_TEMP_FRAME.src != "about:blank")
            window.frames["_SAVEASIMAGE_TEMP_FRAME"].document.execCommand("SaveAs");
    }*/
    return new Merge();
});
