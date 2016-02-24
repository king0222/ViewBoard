define(['template'],function(template){
	var path = 'http://pic.huashengju.com/',
		noPic = '/design/images/iconfont-wutupian.png';
	return {
		category: function(data) {
			var tmpl = '{{if status}}' +
				'{{each list as category index}}'+
				'<div class="category clearfix">' +
                    '<strong class="category-title">{{category.name}}</strong>' +
                    '<div class="category-list">' +
                    	'{{each category.subs as sub i}}' +
                  		'<div class="category-box product-category{{if sub.areaid}} sub-category{{/if}}" {{if sub.size_ids}}data-sizeid="{{sub.size_ids}}"{{/if}} data-source="products" title="{{sub.name}}" {{if sub.catid}}data-catid="{{sub.catid}}"{{/if}}{{if sub.parentid}} data-parentid="{{sub.parentid}}"{{/if}}{{if sub.areaid}} data-sub="true" data-areaid="{{sub.areaid}}"{{/if}}>' +
                        '<div id="drag-item-{{sub.catid}}" class="drag-item widget" style="background-image:url({{if sub.thumb_image}}{{sub.thumb_image}}{{else}}'+ noPic +'{{/if}});"></div>' +
                        '<a href="javascript:void(0);">{{sub.name}}</a>' +
                  		'</div>' +
                  		'{{/each}}' +
                    '</div>' +
              	'</div>' +
                '{{/each}}' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		subCategory: function(data) {
			var tmpl = '{{if status}}' + 
				'{{each list}}' +
				'<div class="category-box product-category" title="{{$value.name}}" {{if $value.size_ids}}data-sizeid="{{$value.size_ids}}"{{/if}} data-source="products" {{if $value.catid}}data-catid="{{$value.catid}}"{{/if}} {{if $value.parentid}}data-parentid="{{$value.parentid}}"{{/if}} {{if $value.areaid}}data-areaid="{{$value.areaid}}"{{/if}}>' +
                '<div id="drag-item-{{$value.catid}}" class="drag-item widget" style="background-image:url({{$value.thumb_image}});"></div>' +
                '<a href="javascript:void(0);">{{$value.name}}</a>' +
          		'</div>' +
				'{{/each}}' + 
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		products: function(data) {
			var tmpl = '{{if status}}<div class="clearfix">' + 
				'{{each list}}' +
				'<div class="pro-fav">' +
				'<div class="move drag-item widget" id="product-{{$index}}" data-catid="{{$value.catid}}" data-proid="{{$value.proid}}" data-goodsid="{{$value.goods_id}}" draggable="true" data-name="{{$value.name}}"' +
				'{{if $value.areaid}} data-areaid="{{$value.areaid}}"{{/if}}' +
				' data-qualityName="{{$value.quality_name}}" data-pricesale="{{$value.price_sale}}" data-price="{{$value.price}}" data-pricemarket="{{$value.price_market}}" data-dividemomey={{$value.divide_money}}' +
				' data-detailUrl="{{$value.url}}" data-size="{{$value.width}}*{{$value.length}}*{{$value.height}}" style="background-image:url({{$value.thumb_image}});" data-thumb="{{$value.thumb_image}}" data-src="' + path + '{{$value.image_diy}}"></div>' +
				'<a class="add-fav"><i class="iconfont" title="加入收藏">&#xe63e;</i></a>' +
				'</div>' +
				'{{/each}}' + 
				'</div>{{/if}}';
			return template.compile(tmpl)(data);
		},
		backgroundCategory: function(data) {
			var tmpl = '{{if status}}' +
				'<ul>{{each list}}' +
                    '<li class="product-category bg-category" data-source="backgrounds" data-areaid="{{$value.areaid}}">' +
                    	'<div class="img drag-bg" src="{{if $value.thumb_image}}{{$value.thumb_image}}{{else}}'+ noPic +'{{/if}}"></div>' +
                      	'<a href="javascript:void(0);">{{$value.name}}</a>' +
                    '</li>' +
                '</ul>{{/each}}' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		backgrounds: function(data) {
			var tmpl = '{{if status}}' + 
				'<ul>' +
				'{{each list}}<li><img id="drag-bg-{{$value.dbg_id}}" class="drag-bg" draggable="true" src="{{$value.thumb_image}}" data-src="{{$value.image}}"></li>{{/each}}' +
				'</ul>' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		favorites: function(data) {
			var tmpl = '{{if status}}' + 
				'{{each list}}<div class="drag-item widget" id="product-fav-{{$index}}" draggable="true" style="background-image:url({{$value.thumb_image}});" data-pricemarket="{{$value.price_market}}" data-price="{{$value.price}}" ' +
				'data-dividemomey={{$value.divide_money}} data-pricesale="{{$value.price_sale}}" data-proid="{{$value.proid}}" data-goodsid="{{$value.goods_id}}" data-src="{{$value.image}}">' + 
				'<span class="del" data-proid="{{$value.proid}}" data-goodsid="{{$value.goods_id}}" data-type="favorites"><i class="iconfont">&#xe61d;</i></span>' +
				'</div>{{/each}}' + 
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		materials: function(data) {
			var tmpl = '{{if success}}' + 
				'{{each list}}<div class="drag-item widget" id="product-{{$index}}" draggable="true" style="background-image:url({{$value.imgUrl}});" data-src="{{$value.imgUrl}}">' +
				'<span class="del" data-id="{{$value.id}}" data-type="materials"><i class="iconfont">&#xe61d;</i></span>' +
				'</div>{{/each}}' + 
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		combinations: function(data) {
			//0 未提交审核1 待审核2 审核通过3 审核不通过
			//发布状态  0:未发布  1:已发布 2：已下架
			var tmpl = '{{if status}}' +
				'<div class="toolbar">' +
					'<label>审核状态:</label>' +
					'<select class="edit-status">' +
						'<option value="all">全部</option>' +
						'<option value="0">未提交审核</option>' +
						'<option value="1">待审核</option>' +
						'<option value="2">审核通过</option>' +
						'<option value="3">审核不通过</option>' +
					'</select>' +
	              	'<input type="text" class="text input-search" placeholder="套装名称">' +
	              	'<button class="btn icon-search schema-search"><i class="iconfont">&#xe617;</i></button>' +
                '</div>' +
				'{{each list}}' +
				'<div class="combination" data-mcid="{{$value.mcid}}">' +
					'<div class="img" style="background-image:url({{$value.thumb_image_diy}});"></div>' +
					'<p>套装名称: <span class="name" title="{{$value.name}}">{{$value.name}}</span></p>' +
					'<p>产品数量: {{$value.pro_num_sum}}件</p>' +
					'<p><span class="status">{{$value.diy_status_name}}</span></p>' +
					'<p><span class="price">¥:{{$value.price_sale}}<a href="{{$value.showUrl}}" target="_blank">&nbsp;&nbsp;搭配清单</a></span></p>' +
					'<p class="clearfix">' +
						'<span class="status">{{$value.status}}</span>' +
						'{{if $value.publish != 1}}<button class="open" data-mcid="{{$value.mcid}}">编辑</button>{{/if}}' +
						'{{if $value.edit_status == 0}}<button class="docommit" data-mcid="{{$value.mcid}}">提交审核</button>{{/if}}' +
					'</p>' +
				'</div>' +
				'{{/each}}' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		perspectives: function(data) {
			var tmpl = '{{if status}}' + 
				'{{each list as perspect index}}{{each perspect.diy_image_arr as per i}}<div class="drag-item widget" style="background-image:url({{per.thumb_image}});" data-src="{{per.image}}"></div>{{/each}}{{/each}}' + 
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		details: function(data) {
			var tmpl = '{{if status}}' +
				'{{each list as perspect index}}' +
				'<img src="{{perspect.thumb_image}}">' +
				'<div class="detail">' +
				'<p style="color:#000">{{perspect.name}}</p>' +
				'{{each perspect.size_value_list as size i}}<p>{{size.name}}：{{size.value}}</p>{{/each}}' +
				'<p>销售价：<span style="color:#f00">￥{{perspect.price_sale}}</span>&nbsp;&nbsp;&nbsp;&nbsp;提成金额：<span style="color:#f00">￥{{perspect.divide_money}}</span></p>' +
				'<p><a href="{{perspect.showUrl}}" target="_blank">更多详情...</a></p>' +
				'</div>' +
				'{{/each}}' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		cropPerspect: function(data) {
			var tmpl = '{{if status}}' +
				'{{each list as perspect index}}' +
				'{{each perspect.diy_image_arr as per i}}<img src="{{per.thumb_image}}" style="margin:3px;float:left;" draggable="true" data-src="{{per.image}}">{{/each}}' +
				'{{/each}}' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		//generate toolbar 
		//{title1: xx, title2: yy, toolbar: true}
		crumb: function(data) {
			var tmpl = '<div class="crumbs"><a class="level-to" data-level="1" href="#">产品库</a> >> <a {{if title2}}class="level-to"{{/if}} data-level="2" href="#">{{title1}}</a> {{if title2}}>> <a data-level="3" href="#">{{title2}}</a>{{/if}}</div>' +
				'{{if toolbar}}' +
                '<div class="mod toolbar">' +
                  	'<input type="text" class="text input-search product-input" placeholder="搜索关键字" {{if keyword}}value="{{keyword}}"{{/if}}>' +
                  	'<button class="btn icon-search product-search"><i class="iconfont">&#xe617;</i></button>' +
                  	'<button class="btn product-filter"><i class="iconfont">&#xe65c;</i></button>' +
                  	'<button class="btn icon-refresh product-refresh"><i class="iconfont">&#xe661;</i></button>' +
                '</div>' +
                '{{/if}}';
            return template.compile(tmpl)(data);
		},
		productFilter: function(data) {
			var tmpl = '<div class="product-filter" id="productFilter" style="display: none;">' +
			  		'<span class="close"><i class="iconfont">&#xe61d;</i></span>' +
			  		'<div class="filter-content">' +
			  			'<table class="filter-table"><tr>' +
			  			'<td><label>区域:</label></td>' +
			  			'<td><select class="area"><option value="0">全部</option>{{each match_area}}<option value="{{$value.areaid}}">{{$value.name}}</option>{{/each}}</select></td>' +
		  				'</tr>' +
			  			/*'<tr>' +
			  			'<td><label>长度:</label></td>' +
			  			'<td><input class="size min-length" type="number" min="0"> cm -- <input class="size max-length" type="number" min="0"> cm</td>' +
			  			'</tr>' +
			  			'<tr>' +
			  			'<td><label>宽度:</label></td>' +
			  			'<td><input class="size min-width" type="number" min="0"> cm -- <input class="size max-width" type="number" min="0"> cm</td>' +
			  			'</tr>' +
			  			'<tr>' +
			  			'<td><label>高度:</label></td>' +
			  			'<td><input class="size min-height" type="number" min="0"> cm -- <input class="size max-height" type="number" min="0"> cm</td>' +
			  			'</tr>' +*/
			  			'<tr>' +
			  			'<td><label>价格:</label></td>' +
			  			'<td>{{each product_price_range}}<div class="price-radio"><label><input type="radio" name="price" value="{{$value.price_range_val}}">{{$value.price_range_name}}</label></div>{{/each}}</td>'+
			  			'</tr>' +
			  			'<tr>' +
			  			'<td><label>风格:</label></td>' +
			  			'<td>{{each product_style}}<div class="style-radio"><label><input type="radio" name="style" value="{{$value.styleid}}">{{$value.name}}</label></div>{{/each}}</td>' +
			  			'</tr>' +
			  			'</table>' +
			  			'<button class="ok">确定</button>'
			  		'</div>' +
				'</div>';
			return template.compile(tmpl)(data);
		},
		sizeList: function(data) {
			var tmpl = '{{if status}}' +
					'{{each list as rule index}}' +
						'{{if rule.size_id == 1}}' +
							'<tr class="new-add" data-sizeid="1">' +
							'<td><label>{{rule.name}}:</label></td>' +
							'<td><div class="color-holder"><span class="color none active"></span>{{each rule.size_value_arr}}<span class="color" title="{{$value.value}}" style="background:{{$value.color_value}}" data-sizevalueid="{{$value.size_value_id}}"></span>{{/each}}</div></td>' +
							'</tr>' +
							'{{else}}' +
							'<tr class="new-add" data-sizeid="{{rule.size_id}}">' +
				  			'<td><label>{{rule.name}}:</label></td>' +
				  			'<td>{{each rule.size_value_arr}}<div class="style-radio"><label><input class="size-checkbox" type="checkbox" name="style" value="{{$value.size_value_id}}">{{$value.value}}</label></div>{{/each}}</td>' +
				  			'</tr>' +
				  			'<tr>' +
						'{{/if}}' +
					'{{/each}}' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		},
		areas: function(data) {
			var tmpl = '{{each match_area}}' +
				'<label{{if $index == 0}} class="active"{{/if}}><input name="space" type="checkbox" vlaue="{{$value.areaid}}" data-value="{{$value.areaid}}" {{if $index == 0}}checked="checked"{{/if}}/>{{$value.name}}</label>' +
				'{{/each}}';
			return template.compile(tmpl)(data);
		},
		styles: function(data) {
			var tmpl = '{{each product_style}}' +
				'<option value="{{$value.styleid}}">{{$value.name}}</option>' +
				'{{/each}}';
			return template.compile(tmpl)(data);
		},
		matchStyles: function(data) {
			var tmpl = '{{each match_style}}' +
				'<option value="{{$value.styleid}}">{{$value.name}}</option>' +
				'{{/each}}';
			return template.compile(tmpl)(data);
		},
		productDetail: function(data) {
			var tmpl = '{{if status == 1}}' +
				'{{each list as perspect index}}' +
				'<img src="{{perspect.thumb_image}}" style="margin:auto;display:block;">' +
				'<p>{{perspect.name}}</p>' +
				'<p>销售价：<span class="price" style="color:red;">¥{{perspect.price_sale}}</span></p>' +
				'<p style="margin-bottom:5px;">提成金额：<span style="color:red;">¥{{perspect.divide_money}}</span></p>' +
				'{{each perspect.size_value_list as size i}}<p style="color:#aaa;">{{size.name}}：{{size.value}}</p>{{/each}}' +
				'<p style="text-align:center;"><button class="add-to-canvas" data-id="{{perspect.data_id}}">插入搭配</button></p>' +
				'{{/each}}' +
				'{{/if}}';
			return template.compile(tmpl)(data);
		}
	};
});