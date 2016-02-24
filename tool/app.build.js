({
	//构建过程：
	//cd ../tool
	//node r.js -o app.build.js
	//修改页面DEBUGGER值为false;
	
	//项目目录
	appDir:'../',

	//模块目录
	baseUrl:'js',

	//优化后的代码存放目录
	dir:'../build',

	//optimize:'none',
	optimizeCss: "standard",

	//路径别名, If relative paths, set relative to baseUrl above.
	paths:{
		'jquery':'lib/jquery-2.1.4.min',
		'template': 'lib/template',
		'jqueryUI': 'lib/jquery-ui.min',
		'transport': 'lib/jquery.iframe-transport',
        'fileupload': 'lib/jquery.fileupload',
		'ux': 'DIY/ux',
		'canvas': 'DIY/canvas',
		'jscolor': 'lib/jscolor',
		'tooltipster': 'lib/jquery.tooltipster.min',
		'kindeditor': '../../statics/js/kindeditor/kindeditor-all-min',
        'initEditor': '../../statics/js/kindeditor/initKindEditor',
		'main': 'DIY/index'
	},

	//模块
	//['jquery', 'jqueryUI', 'ux/ux-tool', 'ux/ux-item', 'ux/ux-style', 'ux/ux-bg', 'canvas/main', 'ux/ux-callapi', 'ux/ux-bannerAnimate', 'jscolor'
	modules:[
		{
			name:'main',
			include: ['jquery',
					  'jqueryUI',
                      'ux/ux-tool',
                      'ux/ux-item',
                      'ux/ux-style',
                      'ux/ux-bg',
                      'canvas/main',
                      'ux/ux-callapi',
                      'ux/ux-bannerAnimate',
                      'jscolor'
            ]
		}
	]
})


