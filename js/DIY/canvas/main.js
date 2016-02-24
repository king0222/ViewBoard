/*require.config({
  urlArgs : 'date='+ (new Date()).getTime(),
  baseUrl : '/design/js/DIY',
  //urlArgs : "v=20150917",
  paths: {
        jquery: '/design/js/lib/jquery-2.1.4.min'
    }
});*/

define(['jquery', 'jqueryUI', 'canvas/canvas_to_blob', 'canvas/tools', 'canvas/util', 'canvas/zoom', 'canvas/pen', 'canvas/magic_wand', 'canvas/marching_ants', 'canvas/selection', 'canvas/crop'],function($, jqueryUI, blob, tools, util, zoom, pen, magicWand, marchingAnts, selection, crop){

    var pasteBoard = document.querySelector('#pasteBoard');
    var artCanvas = document.querySelector('#artCanvas');
    var artContext = artCanvas.getContext('2d');
    var selectionCanvas = document.querySelector('#selectionCanvas');
    var selectionContext = selectionCanvas.getContext('2d');
    var penCanvas = document.querySelector('#penCanvas');

    var body = document.body;
    var loadImg = document.createElement('img');



    var saveImage = function(e) {
        /**
         * two ways to save image
         */
        var dataURL, canvas = null, type = 'jpg';
        var artCanvas = document.querySelector('#artCanvas');
        if(tools.currentToolClass === 'penTool') {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            //document.querySelector('#pMask').dispatchEvent(event);

            canvas = pen.getMaskImage(artCanvas, artCanvas.img);
            dataURL = canvas.toDataURL("image/jpeg", 0.5);
        } else { //cropTool
            canvas = artCanvas.compositCanvas;
            dataURL = canvas.toDataURL("image/jpeg", 0.5);
        }
        var filename = 'baidufe_' + (new Date()).getTime() + '.' + type;
        
        if (canvas.msToBlob) { //for IE
            var blob = canvas.msToBlob();
            window.navigator.msSaveBlob(blob, filename);
        } else {
            saveFile(dataURL,filename);    
        }
        

        function saveFile(data, filename){
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = data;
            save_link.download = filename;
           
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        };

    }
    

    

    function showPlaceholder(e) {
        artContext.drawImage(loadImg, 0, 0);
    }

    function enableOptions() {
        var cropHolder = document.querySelector('.cropHolder');
        var inputs = cropHolder.querySelectorAll('input');
        var buttons = cropHolder.querySelectorAll('button');
        Array.prototype.forEach.call(inputs, function(input) {
            input.removeAttribute('disabled');
        });
        Array.prototype.forEach.call(buttons, function(button) {
            button.removeAttribute('disabled');
        });
    }

    function disableOptions() {
        var cropHolder = document.querySelector('.cropHolder');
        var inputs = cropHolder.querySelectorAll('input');
        var buttons = cropHolder.querySelectorAll('button');
        Array.prototype.forEach.call(inputs, function(input) {
            input.setAttribute('disabled', 'disabled');
        });
        Array.prototype.forEach.call(buttons, function(button) {
            button.setAttribute('disabled', 'disabled');
        });
    }

    function readFile(e) {
        e.preventDefault();

        var file = e.dataTransfer.files[0],
            reader = new FileReader();
        reader.onload = function (event) {
            if(file.type.indexOf("image") > -1){
                reloadImage(event.target.result);
            }
        };
        reader.readAsDataURL(file);

        return false;
    }

    function reloadImage(data) {
        var img = new Image();
        img.onload = function(){
            document.querySelector('#tools').style.display = 'block';
            artCanvas = document.querySelector('#artCanvas');
            var w = img.width;
            var h = img.height;
            var winWidth = artCanvas.parentNode.offsetWidth;
            var winHeight = artCanvas.parentNode.offsetHeight;
            var cw = artCanvas.parentNode.offsetWidth,
                ch = artCanvas.parentNode.offsetHeight;
            var level = zoom.calculateInitialZoomLevel(Math.min(winWidth/w, winHeight/h));

            artContext.clearRect(0, 0, artCanvas.width, artCanvas.height);
            artCanvas.width = artCanvas.origWidth = cw;
            artCanvas.height = artCanvas.origHeight = ch;
            // artContext.drawImage(img, 0, 0);
            artCanvas.origCanvas = document.createElement('canvas');
            artCanvas.origCanvas.width = cw;
            artCanvas.origCanvas.height = ch;

            artCanvas.bitmapMaskedCanvas = document.createElement('canvas');
            artCanvas.bitmapMaskedCanvas.width = cw;
            artCanvas.bitmapMaskedCanvas.height = ch;

            artCanvas.compositCanvas = document.createElement('canvas');
            artCanvas.compositCanvas.width = cw;
            artCanvas.compositCanvas.height = ch;

            //参数说明
            //context.drawImage(img, 0, 0, img.width, img.height, options.left, options.top, options.width, options.height);
            
            var scaleW = w, scaleH = h;
            if (w / h > cw / ch && w > cw) {
                scaleW = cw;
                scaleH = h * scaleW / w;
            }
            if (w / h < cw / ch && h > ch) {
                scaleH = ch;
                scaleW = w * scaleH / h;
            }

            artCanvas.origCanvas.getContext('2d').drawImage(img, 0, 0, w, h, (cw - scaleW) / 2, (ch - scaleH) / 2, scaleW, scaleH);
            artCanvas.bitmapMaskedCanvas.getContext('2d').drawImage(img, 0, 0, w, h, (cw - scaleW) / 2, (ch - scaleH) / 2, scaleW, scaleH);
            artCanvas.compositCanvas.getContext('2d').drawImage(img, 0, 0, w, h, (cw - scaleW) / 2, (ch - scaleH) / 2, scaleW, scaleH);

            zoom.zoomTo(7);
            pen.reset();

            artCanvas.img = this;
            
            localStorage.setItem(crop.CROP_IMAGE_WIDTH, scaleW);
            localStorage.setItem(crop.CROP_IMAGE_HEIGHT, scaleH);
        };
        localStorage.setItem(crop.CROP_IMAGE, data);
        img.crossOrigin = '';
        img.src = data;
        //window.addEventListener('resize', redraw, false);
    }

    function rebuild() {
        var w = artCanvas.origWidth * zoom.zoomRatio;
        var h = artCanvas.origHeight * zoom.zoomRatio;
        artContext.clearRect(0, 0, artCanvas.width, artCanvas.height);
        artContext.drawImage(artCanvas.compositCanvas, 0, 0, artCanvas.origWidth, artCanvas.origHeight, 0, 0, w, h);
        penCanvas.getContext('2d').clearRect(0, 0, artCanvas.width, artCanvas.height);
        selectionContext.clearRect(0, 0, artCanvas.width, artCanvas.height);
        pen.reset();
        tools.unselect();
        crop.reset(artCanvas.img);
    }

    function resetCropBackground() {
        //保存截图需要的数据，图片base64字符串，宽度，高度
        var artCanvas = document.querySelector('#artCanvas');
        var imgData = pen.getMaskImage(artCanvas, {width: artCanvas.width, height: artCanvas.height}).toDataURL();
        localStorage.setItem(crop.CROP_IMAGE, imgData);
        localStorage.setItem(crop.CROP_IMAGE_WIDTH, artCanvas.width);
        localStorage.setItem(crop.CROP_IMAGE_HEIGHT, artCanvas.height);
    }


    function redraw(e) {
        zoom.render();
    }




    // Pen Tool Options
    // 
    $('body').on('click', '.views img', function() {
        tools.unselect();
        reloadImage(this.getAttribute('data-src'));
    });
    $('body').on('click', '.get-color', function() {
        var color = '#' + document.querySelector('.jscolor').value;
        pen.drawColor(penCanvas.getContext('2d'), color);
    });
    $('body').on('click', '.apply-color', function() {
        var artCanvas = document.querySelector('#artCanvas'),
            artContext = artCanvas.getContext('2d'),
            penCanvas = document.querySelector('#penCanvas');
        pen.drawColor(artCanvas.getContext('2d'), '#' + document.querySelector('.jscolor').value);
        penCanvas.getContext('2d').clearRect(0, 0, artCanvas.width, artCanvas.height);
        pen.reset();
        resetCropBackground();
    });

    document.querySelector('.rebuild').onclick = function(e) {
        rebuild();
    }
    /*document.querySelector('.crop-operation .cancel').onclick = function() {
        crop.deactive();
        tools.unselect();
    }
    document.querySelector('.crop-operation .yes').onclick = function() {
        var artCanvas = document.querySelector('#artCanvas'),
            artContext = artCanvas.getContext('2d');
        var paths = crop.getPaths();
        var cropCanvas = pen.getCropImage(artCanvas, paths);
        var x = (paths[1].x - paths[0].x) / 2,
            y = (paths[2].y - paths[0].y) / 2;
        artContext.clearRect(0, 0, artCanvas.width, artCanvas.height);
        artContext.drawImage(cropCanvas, 0, 0, cropCanvas.width, cropCanvas.height, paths[0].x, paths[0].y, cropCanvas.width, cropCanvas.height);

        resetCropBackground();
        tools.unselect();
    }*/


    document.querySelector('#cropImage').onclick = function(e) {
        var handler = document.querySelector('#' + document.querySelector('#handler').getAttribute('data-handlerid'));
        if (handler.className.indexOf('drag-bg') != -1) {
            alert('背景无法编辑！');
            return false;
        }
        tools.unselect();
        var imgSrc = document.querySelector('#handler').getAttribute('data-src');
        reloadImage(imgSrc);
        $('.cropHolder').dialog({
            width: 1200,
            height: 650,
            modal: true,
            dialogClass: 'crop-dialog',
            resizable: false,
            closeOnEscape: false,
            show: { effect: "blind", duration: 800 },
            focus: function() {
                $('jscolor').blur();
                if (jscolor && !window.colorInstall) {
                    jscolor.install();
                    jscolor.bind();    
                    window.colorInstall = true;
                }
                
            },
            buttons: {
                '确定': function() {
                    //点击确定为artCanvas确认图片
                    //如果是钢笔工具的话，则是将选择的颜色绘制到选定区域内，并重绘artcanvas
                    //如果是截图工具的话，则是原来的mask功能，截图选择区域，并且仅绘制选择区域到artcanvas上面
                    var target = document.querySelector('#' + document.querySelector('#handler').getAttribute('data-handlerid')),
                        proid = target.getAttribute('data-proid'),
                        goodsid = target.getAttribute('data-goodsid');
                    var dataURL, canvas = null, option = {}, paths = [];
                    var artCanvas = document.querySelector('#artCanvas');
                    if (tools.currentToolClass === 'cropTool') {
                        paths = crop.getPaths();
                        var cropCanvas = pen.getCropImage(artCanvas, paths);
                        dataURL = cropCanvas.toDataURL();
                    } else {
                        if (localStorage.getItem(crop.CROP_IMAGE_WIDTH)) {
                            var w = parseInt(localStorage.getItem(crop.CROP_IMAGE_WIDTH)), 
                                h = parseInt(localStorage.getItem(crop.CROP_IMAGE_HEIGHT)),
                                W = artCanvas.width,
                                H = artCanvas.height;
                            paths.push({x: (W - w) / 2, y: (H - h) / 2});
                            paths.push({x: (W + w) / 2, y: (H - h) / 2});
                            paths.push({x: (W + w) / 2, y: (H + h) / 2});
                            paths.push({x: (W - w) / 2, y: (H + h) / 2});
                            var cropCanvas = pen.getCropImage(artCanvas, paths);
                            dataURL = cropCanvas.toDataURL();
                        } else {
                            dataURL = artCanvas.toDataURL();
                        }
                    }

                    var ah = paths[3].y - paths[0].y,
                        aw = paths[1].x - paths[0].x,
                        ra = aw / ah,
                        rw,
                        rh;

                    var $w = $('#handler').width(), $h = $('#handler').height();
                    if ($w > $h) {
                        rw = $w;
                        rh = rw / ra;
                    } else {
                        rh = $h;
                        rw = rh * ra;
                    }
                    var json = {
                        css: {
                            width: rw,
                            height: rh
                        }
                    };
                    
                    $('#' + $('#handler').attr('data-handlerid')).css({
                        'background-image': 'url('+dataURL+')',
                        width: rw + 'px',
                        height: rh + 'px'
                    }).attr({
                        'data-src': dataURL,
                        'data-json': JSON.stringify(json)
                    });
                    $('#handler').attr({
                        'data-src': dataURL,
                        'data-json': JSON.stringify(json)
                    }).css({
                        width: rw + 'px',
                        height: rh + 'px'
                    });
                    $(this).dialog('close');
                },
                /*'保存': function() {
                    var target = document.querySelector('#' + document.querySelector('#handler').getAttribute('data-handlerid')),
                        proid = target.getAttribute('data-proid'),
                        goodsid = target.getAttribute('data-goodsid');
                    var dataURL, canvas = null, option = {};
                    var artCanvas = document.querySelector('#artCanvas');
                    if(tools.currentToolClass === 'penTool') {
                        canvas = pen.getMaskImage(artCanvas, artCanvas.img);
                        dataURL = canvas.toDataURL();
                    } else { //cropTool
                        canvas = artCanvas.compositCanvas;
                        dataURL = canvas.toDataURL();
                    }
                    var head = 'data:image/png;base64,';
                    var imgFileSize = Math.round((dataURL.length - head.length)*3/4) ;
                    option.proid = proid;
                    option.goods_id = goodsid;
                    option.image_diy_base64 = dataURL;
                    option.size = imgFileSize;
                    savePerspect(option);
                    pen.reset();
                },*/
                '取消': function() {
                    $('.cropHolder').dialog('close');
                }
            }
        });
    };

    // init
    tools.init('#tools');

});