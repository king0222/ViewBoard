(function ($){
	$.fn.initKindEditor = function ( config ){
		var _config = {
				width:'100%',							//宽度高度的默认值是textarea的宽高
				height:'400px',							
				langType:'zh_CN',  					//语言类型  lang文件夹中js的文件名
				readonlyMode:false, 				//只读模式
				newlineTag:'p',							//换行符是p，br
				pasteType : 2,							//0=禁止粘贴   1=文本粘贴   2=HTML粘贴
				autoHeightMode : true,		
				///////////////////////////////////////
				themeType:'simple',	//会去额外加载themes/simple/simple.css，themes/default/default.css总会加载
				resizeType : 1,			//0不能拖动，1能改变高度，2可以改变高度和宽度
				basePath:'/statics/js/kindeditor/',  //设置基本路径后面的css、plugin、lang路径会加载这个基本路径后面
				
				uploadJson:'/?m=admin&c=kindeditor&a=uploadImage',//上传文件的服务器端程序
				allowFileUpload:true,     //显示文件上传的按钮
				allowImageUpload : true,//显示图片上传的按钮
				fillDescAfterUploadImage :true, //图片上传成功后切换到图片编辑标签 ,false会直接关闭弹窗
				
				fontSizeTable : ['9px', '10px','12px', '14px', '16px', '18px', '24px', '32px'],//字体大小
				items : [
								'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'cut', 'copy', 'paste',
								'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
								'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
								'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
								'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
								'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
								'flash', 'media', 'insertfile', 'table', 'hr', 'pagebreak',
								'anchor', 'link', 'unlink', 'baidumap'
				 ]
			};
		_config = $.extend( _config , config );
		var editor = KindEditor.create(this, _config);
		return editor;
	};	
})(jQuery);