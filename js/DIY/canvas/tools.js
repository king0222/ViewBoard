define(['canvas/util', 'canvas/magic_wand', 'canvas/path_selection', 'canvas/pen', 'canvas/zoom', 'canvas/crop'],function(util, magicWandTool, pathSelectionTool, penTool, zoomTool, cropTool){
    var SELECTED_CLASS = 'selected';

    var MAGIC_WAND_CLASS = 'magicWandTool';
    var PATH_SELECTION_CLASS = 'pathSelectionTool';
    var PEN_CLASS = 'penTool';
    var ZOOM_CLASS = 'zoomTool';


    function Tools() {
        /*default tool
        this.currentTool = this.toolsList.penTool;
        this.currentTool.node = document.querySelector('.' + PEN_CLASS);
        this.currentTool.active();*/
    }

    Tools.prototype.toolsList = {
        /*magicWandTool: magicWandTool,
        pathSelectionTool: pathSelectionTool,
        zoomTool: zoomTool,*/
        penTool: penTool,
        cropTool: cropTool
    };

    Tools.prototype.unselect = function() {
        var self = this;
        if (self.currentTool) {
            self.currentTool.deactive();
            util.DOM.cssjs('remove', self.currentTool.node.parentNode, SELECTED_CLASS); 
            self.currentTool = null;
            self.currentToolClass = '';
        }
        $('.crop-option .colors').find('button, input').attr('disabled', 'true');
    };

    Tools.prototype.init = function(container) {
        var self = this;
        function changeTool(e) {
            e.stopPropagation();

            var t = e.target;
            if(!util.DOM.cssjs('check', t.parentNode, 'canvas-tool')) return;
            // done with the old tool
            if (self.currentTool) {
                self.currentTool.deactive();
                util.DOM.cssjs('remove', self.currentTool.node.parentNode, SELECTED_CLASS); 
            }
            // set up the new tool
            util.DOM.cssjs('add', t.parentNode, SELECTED_CLASS);
            self.currentTool = self.toolsList[t.getAttribute('data-tool')];
            self.currentToolClass = t.getAttribute('data-tool');
            self.currentTool.node = t;
            self.currentTool.active();
            if (self.currentTool == penTool) {
                $('.crop-option .colors').find('button, input').removeAttr('disabled');
            } else {
                $('.crop-option .colors').find('button, input').attr('disabled', 'true');
            }
        }

        container = container.nodeType ? container : document.querySelector(container);
        container.addEventListener('click', changeTool);
    };

    return new Tools();
});