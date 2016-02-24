require.config({
  urlArgs : DEBUGGER ? 'date='+ (new Date()).getTime() : 'V=20151106',
  baseUrl : '/design/js/DIY',
  paths: {
        /*index: DEBUGGER ? '/design/js/DIY/index' : '/design/build/js/DIY/index',*/
        jquery: '/design/js/lib/jquery-2.1.4.min',
        template: '/design/js/lib/template',
        jqueryUI: '/design/js/lib/jquery-ui.min',
        transport: '/design/js/lib/jquery.iframe-transport',
        fileupload: '/design/js/lib/jquery.fileupload',
        jscolor: '/design/js/lib/jscolor',
        tooltipster: '/design/js/lib/jquery.tooltipster.min',
        kindeditor: '/statics/js/kindeditor/kindeditor-all-min',
        initEditor: '/statics/js/kindeditor/initKindEditor'
    }
});
require(['jquery', 'jqueryUI', 'ux/ux-tool', 'ux/ux-item', 'ux/ux-style', 'ux/ux-bg', 'canvas/main', 'ux/ux-callapi', 'ux/ux-bannerAnimate', 'jscolor'],function($, $ui, $tool, $item, $style, $bg, canvas, $callapi, BannerAnimate, jscolor){

	new BannerAnimate('headerCanvas').init();

    $(function(){
    	$tool.init();
    	$item.init();
    	$bg.init();
    	$style.init();
    });
});