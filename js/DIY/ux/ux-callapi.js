define(['jquery', 'ux/jquery.common', 'tooltipster', 'ux/ux-api', 'ux/ux-pagenation', 'ux/ux-bg', 'ux/ux-item', 'ux/ux-history', 'ux/ux-tool', 'canvas/merge'], function($, common, tooltipster, api, Pagenation, $bg, $item, history, $tool, merge) {

	var $callAPI = {
		initPage: function() {
			$callAPI.getCategory({});

			//初始化过滤细节
	        api.getProductFilter(function(filter, areas, styles, matchStyles, data) {
	            $('body').append(filter);
	            $('#schemaHolder .area').html(areas);
	            $('#schemaHolder .style').html(matchStyles);
	            var d = {status: 1, list: data.match_area};
	            api.getBackgroundCategory(d, function(html, data) {
	                $('#backgrounds .levels:first-child .content').html(html);
	            });
	        });

	        //用户登录信息
	        var $loginInfo = $('.login_cookie_data'), 
	        	uid = $loginInfo.attr('uid'),
	        	username = $loginInfo.attr('username');
        	common.user.uid = uid;
        	common.user.username = username;

        	//页面打开的时候获取历史编辑记录
        	var version = localStorage.getItem('version');
        	if (!version || version < common.version) {
        		localStorage.clear();
        		localStorage.setItem('version', common.version);
        	} else {
        		var history = localStorage.getItem('history');
	        	if (history) {
	        		$('#drag-target').html(history);
	        		$item.unselect();
					$bg.unselect();
	        		/*var handlerid = $('#handler').attr('data-handlerid');
	        		if (handlerid) {
						api.getPerspectives({proid:$('#' + handlerid).attr('data-proid'), goods_id: $('#' + handlerid).attr('data-goodsid')}, function(html, detail, cropHtml) {
							$('#attrStyle .content').html(html);
							if (detail) {
								$('#prodectDetail').show().find('.content').html(detail);
							}
							$('.crop-option .views .content').html(cropHtml);
						});

					}*/
					$('.loading-remind').fadeOut();
	        	}
        	}
        	
		},
		showSchema: function(data) {
			$("#drag-target .drag-item:not(.handler), #drag-target .drag-bg").remove();
			$item.unselect();
			$bg.hideTools();
			$('#handler').hide();
			history.push($('#drag-target').html());

			data = data.diy_info;
			for (var i = 0; i < data.length; i++) {
				var da = data[i];
				if (da.isBg) {
					$('<img>', {
						'class': 'drag-bg',
						'id': 'drag-handler-drag-bg-1',
						'src': da.img,
						'data-src': da.img,
						'data-json': JSON.stringify(da.json)
					}).css({
						'width': da.width + 'px',
						'height': da.height + 'px',
						'z-index': 0,
						'top': da.top + 'px',
						'left': da.left + 'px'
					}).appendTo($('#drag-target'));
					$bg.showTools();
				} else {
					$('<div>', {
						'class': 'drag-item widget',
						'id': 'drag-handler-' + i,
						'data-proid': da.proId,
						'data-goodsid': da.goodsId,
						'data-price': da.price,
						'data-pricesale': da.price_sale,
						'data-pricemarket': da.price_market,
						'data-dividemomey': da.divide_money,
						'data-name': da.name,
						'data-qualityname': da.qualityName,
						'data-detailurl': da.detailUrl,
						'size': da.size,
						'data-src': da.img,
						'data-json': JSON.stringify(da.json)
					}).css({
						'width': da.width + 'px',
						'height': da.height + 'px',
						'top': da.top + 'px',
						'left': da.left + 'px',
						'z-index': da.zIndex,
						'background-image': 'url(' + da.img + ')',
						'transform': 'rotateX(0deg) rotateY(0deg) rotateZ(' + da.rotate + 'deg) scale3d(' + da.flip + ', ' + da.flop + ', 1) translate3d(0px, 0px, 0px) skew(0deg, 0deg)'
					}).appendTo($('#drag-target'));
				}
			}
		},
		init: function() {
			$callAPI.initPage();
			//点击产品或者背景分类切换tab的过程
			common.event({
				obj: '.product-category',
				eventType: 'click',
				fn: function($this, e) {
					var $this = $($this),
						category = $this.attr('data-source');
					if (category === 'products') {
						if ($this.attr('data-sub')) {
							$this.parents('.levels').hide().next().show();
							var $holder = $('#products .levels:nth-child(2)');
							var crumb = api.getCrumb({title1: $this.attr('title'), toolbar: false});
							$holder.find('.crumbs, .toolbar').remove().end().prepend(crumb);
							$callAPI.getSubCategory({areaid: $this.attr('data-areaid')}, $holder.find('.content')[0]);
							$callAPI.title1 = $this.attr('title');
						} else {
							$this.parents('.levels').hide().next().show();
							var $holder = $this.parents('.levels').next();
							var option = {catid: $this.attr('data-catid'), page: 1};
							$callAPI.catid = option.catid;
							if ($this.attr('data-parentid')) {
								option['parent_catid'] = $this.attr('data-parentid');
								$callAPI.parentid = $this.attr('data-parentid');
								var crumb = api.getCrumb({title1: $this.attr('title'), toolbar: true});
								$holder.find('.crumbs, .toolbar').remove().end().prepend(crumb);
							} else {
								$callAPI.parentid = null;
							}
							if ($this.attr('data-areaid')) {
								option['areaid'] = $this.attr('data-areaid');
								$callAPI.areaid = $this.attr('data-areaid');
								var crumb = api.getCrumb({title1: $callAPI.title1, title2: $this.attr('title'), toolbar: true});
								$holder.find('.crumbs, .toolbar').remove().end().prepend(crumb);
							} else {
								$callAPI.areaid = null;
							}
							option.num = api.config.PAGENUM;
							$callAPI.getProducts(option, $holder.find('.content')[0]);
						}
						var sizeId = $this.attr('data-sizeid');
						if (sizeId) {
							api.getSizeList({sizeid: sizeId}, function(html, data) {
								$('#productFilter .filter-table').find('.new-add').remove().end().append(html);
							});
						}
					}
					if (category === 'backgrounds') {
						api.getBackgrounds({areaid: $this.attr('data-areaid')}, function(html) {
							$this.parents('.levels').hide().siblings('.levels').show().find('.content').html(html);
						});
					}
				}
			});
			//tab切换的时候call api获取内容，仅处理需要登录才能看到的内容
			common.event({
				obj: '#mainTab li',
				eventType: 'click',
				fn: function($this, e) {
					var $this = $($this);
					//如果已经登录才call api
					if (common.user.uid) {
						if ($this.attr('data-id') === 'combinations' && !$this.attr('data-done')) {
							if (navigator.onLine) {
								$callAPI.getCombinations({}, null, function() {
									$this.attr('data-done', 'true');
								});
							} else {
								try {
						        	var schemas = localStorage.getItem('programs');
						        	if (schemas) {
						        		schemas = JSON.parse(schemas);
						        		api.getCombinationsOffline({success: 1, list: schemas}, function(html) {
						        			$('#combinations .content').html(html);
											$this.attr('data-done', 'true');
						        		});
						        		//$callAPI.showSchema(schemas[schemas.length - 1]);
						        	}
						        } catch (e) {
						        	console.log('browser does not support localStorage API!');
						        }
							}
						}
						if ($this.attr('data-id') === 'myFavorites' && !$this.attr('data-done')) {
							var option = {
								num: api.config.PAGENUM,
								page: 1
							};
							api.getFavorites(option, function(html, data) {
								$('#myFavorites .content').html(html);
								$this.attr('data-done', 'true');
							});
						}
						if ($this.attr('data-id') === 'materials' && !$this.attr('data-done')) {
							api.getMaterials(function(html) {
								$('#materials .content').html(html);
								$this.attr('data-done', 'true');
							});
						}
					}

				}
			});
			//一级产品搜索
			common.event({
				obj: '#products .category-search',
				eventType: 'click',
				fn: function($this) {
					var keyword = $('.category-input').val();
					if (keyword) {
						$('#products .levels:nth-child(2)').show().prev().hide();
						var $holder = $('#products .levels:nth-child(2)');

						var crumb = api.getCrumb({title1: keyword, toolbar: true, keyword: keyword});
						$holder.find('.crumbs, .toolbar').remove().end().prepend(crumb);

						$callAPI.searchProducts(keyword, $holder);
					}
					//$callAPI.getCategory(option);
				}
			});
			//搜索单品
			common.event({
				obj: '#products .product-search, #products .product-refresh',
				eventType: 'click',
				fn: function($this, e) {
					var keyword = $('.product-input').val();
					if (keyword) {
						var $holder = $($this).parents('.levels');
						$callAPI.searchProducts(keyword, $holder);
					} else {
						var option = {page: 1, num: api.config.PAGENUM};
						if ($callAPI.catid) {
							option.catid = $callAPI.catid;
						} else {
							alert('请输入搜索关键字！');
							return false;
						}
						if ($callAPI.parentid) {
							option.parent_catid = $callAPI.parentid;
						}
						if ($callAPI.catid) {
							option.catid = $callAPI.catid;
						}
						if ($callAPI.areaid) {
							option.areaid = $callAPI.areaid;
						}
						$callAPI.getProducts(option, $('#products').find('.levels:visible .content')[0]);
					}
				}
			});
			common.event({
				obj: '#products .input-search',
				eventType: 'keyup',
				fn: function($this, e) {
					var $this = $($this), klass = $this.attr('class');
					if (e.keyCode == 13) {
						if (klass.indexOf('category-input') != -1) {
							var keyword = $('.category-input').val();
							if (keyword) {
								$('#products .levels:nth-child(2)').show().prev().hide();
								var $holder = $('#products .levels:nth-child(2)');

								var crumb = api.getCrumb({title1: keyword, toolbar: true, keyword: keyword});
								$holder.find('.crumbs, .toolbar').remove().end().prepend(crumb);

								$callAPI.searchProducts(keyword, $holder);
							}
						}
						if (klass.indexOf('product-input') != -1) {
							var keyword = $('.product-input').val();
							if (keyword) {
								var $holder = $this.parents('.levels');
								$callAPI.searchProducts(keyword, $holder);
							}
						}
					}
					
				}
			});
			//刷新产品分类
			common.event({
				obj: '#products .category-refresh',
				eventType: 'click',
				fn: function() {
					$callAPI.getCategory({});
				}
			});
			
			//点击确定搜索条件
			common.event({
				obj: '#productFilter .ok',
				eventType: 'click',
				fn: function($this) {
					var option = {};
					var $productFilter = $('#productFilter'),
						areaid = $productFilter.find('.area').val(),
						price_range = $productFilter.find('.price-radio input:checked').length ? $productFilter.find('.price-radio input:checked').val() : null,
						style = $productFilter.find('.style-radio input:checked').length ? $productFilter.find('.style-radio input:checked').val() : null,
						keyword = $('.product-input').val() ? $('.product-input').val() : null,
						$color = $productFilter.find('.color.active'),
						$sizeChcekbox = $productFilter.find('.size-checkbox:checked'),
						sizevalueid = [];
					if ($color.length) {
						$color.each(function() {
							sizevalueid.push($(this).attr('data-sizevalueid'));
						});
					}
					if ($sizeChcekbox.length) {
						$sizeChcekbox.each(function() {
							sizevalueid.push($(this).val());
						});						
					}

					if (areaid) option.areaid = areaid;
					if (price_range) option.price_range = price_range;
					if (style) option.style = style;
					if (keyword) option.keyword = keyword;
					if (sizevalueid.length) option.sizevalueid = sizevalueid.join(',');

					if ($callAPI.catid) option.catid = $callAPI.catid;
					if ($callAPI.parentid) option.parent_catid = $callAPI.parentid;

					$callAPI.getProducts(option, $('#products').find('.levels:visible .content')[0]);
					$('#productFilter').toggle();
				}
			});
			//加入收藏
			common.event({
				obj: '.pro-fav .add-fav',
				eventType: 'click',
				fn: function($this) {
					if (!$('.login_cookie_data').attr('uid')) {
						$tool.showLoginDialog('您还未登陆，无法加入收藏！');
						return false;
					}
					var goodsid = $($this).siblings('.drag-item').attr('data-goodsid');
					var option = {
						act: 'add',
						dataid: goodsid,
						idtype: 'goods_id'
					};
					api.handleFavorite(option, function(data) {
						if (data.status == 1) {
							api.getFavorites(option, function(html, data) {
								$('#myFavorites .content').html(html);
							});
							$callAPI.animateFavorite($($this));
						}
					});
				}
			});
			//删除收藏，删除素材
			common.event({
				obj: '.drag-item .del',
				eventType: 'click',
				fn: function($this, e) {
					var $this = $($this);
					var id = $this.attr('data-goodsid'),
						type = $this.attr('data-type');
					if (type === 'favorites') {
						var option = {
							act: 'delete',
							dataid: id,
							idtype: 'goods_id'
						};
						api.handleFavorite(option, function(data) {
							if (data.status == 1) {
								$this.parents('.drag-item').remove();
							}
						});
					}
					if (type === 'materials') {
						api.deleteMaterial({id: id}, function(data) {
							if (data.success) {
								$this.parents('.drag-item').remove();
							}
						});
					}

				}
			});
			//保存方案
			common.event({
				obj: '#menu-tool ul li .save',
				eventType: 'click',
				fn: function($this) {
					if (!$('.login_cookie_data').attr('uid')) {
						$tool.showLoginDialog('您还未登陆，无法保存方案！');
						return false;
					}
					var schema = $tool.getSchema();
					if (!schema.mergeArr.length) {
						alert('空方案无法保存！');
						return false;
					}
					/*if (schema.count < 2) {
						alert('至少搭配两件单品才能保存为方案!');
						return false;
					}*/

					var dragTarget = document.querySelector('#drag-target'),
						imgArr = [];

					
					var param = {
						id: $tool.guid(),
						uid: common.user.uid,
						username: common.user.username,
						user_type: 1,
						count: schema.count,
						diy_info: schema.mergeArr,
						goods_num: schema.goodsArr,
						price: schema.price,
						divide_money: schema.divide_money
					};

					var dataURL = null;
					var cloneArr = [];
					for (var i = 0; i < schema.mergeArr.length; i++) {
						var obj = schema.mergeArr[i], objCopy = {};
						for (var k in obj) {
							objCopy[k] = obj[k];
						}
						cloneArr.push(objCopy);
					}
					function loadimg(obj) {
						var img = new Image();
						img.onload = function() {
							imgArr.push(this);
							obj.img = this;
							if (cloneArr.length === imgArr.length) {
								merge.genComposite(dragTarget.offsetWidth, dragTarget.offsetHeight, cloneArr, function(canvas) {
									var canvasWidth = canvas.width,
										canvasHeight = canvas.height;
									var schemaPreview = document.querySelector('#schemaPreview'),
										preWidth = schemaPreview.width,
										preHeight = schemaPreview.height,
										context = schemaPreview.getContext('2d');

									$('#schemaHolder .price').text('¥' + (schema.price).toFixed(2));
									$('#schemaHolder .divide-money').text('¥' + (schema.divide_money).toFixed(2));
									context.clearRect(0, 0, schemaPreview.width, schemaPreview.height);

									var posX = 0, posY = 0, showW = preWidth, showH = preHeight;
									if (canvasWidth / canvasHeight > preWidth / preHeight) {
										showW = preWidth;
										showH = showW * canvasHeight / canvasWidth; 
										posY = Math.abs((preHeight - showH)) / 2;
									} else {
										showH = preHeight;
										showW = showH * canvasWidth /canvasHeight;
										posX = Math.abs((preWidth - showW)) / 2;
									}

									var newImg = new Image();
									dataURL = canvas.toDataURL();
									newImg.src = dataURL;

									
									newImg.onload = function() {
										context.drawImage(newImg, 0, 0, canvasWidth, canvasHeight, posX, posY, showW, showH);
										var head = 'data:image/png;base64,';
                    					var imgFileSize = Math.round((dataURL.length - head.length)*3/4) ;
                    					param.size = imgFileSize;
										$('#schemaHolder').dialog({
											title: '保存搭配',
											modal: true,
											width: 730,
											height: 450,
											show: { effect: "fadeIn"},
											open: function() {
												$('#schemaHolder').find('.row').removeClass('error');
											},
											buttons: {
												'下一步': function() {
													if (!$tool.validateSchema()) {
														return false;
													}
													openDetailDialog();
												},
												'取消': function() {
													$(this).dialog('close');
												}
											}
										});
									}
								});
									
							}
						}
						img.crossOrigin = '';
						img.src = obj.img;
					}

					function openDetailDialog() {
						$('#schemaDetailHolder').dialog({
							title: '商品详情',
							width: 850,
							height: 700,
							modal: true,
							open: function() {
								$('#schemaHolder').dialog('close');

								$tool.descriptionEditor = $('#description').initKindEditor({ 
									width: 800,
									height: 600,
									fillDescAfterUploadImage:false
			                    });
								$tool.mobileDescriptionEditor = $('#mobileDescription').initKindEditor({  
									width: 640,
									height: 600,
									fillDescAfterUploadImage:false
			                    });
							},
							beforeClose: function() {
								KindEditor.remove('#description');
								KindEditor.remove('#mobileDescription');  
							},
							show: { effect: "fadeIn"},
							buttons: {
								'上一步': function() {
									$(this).dialog('close');
									$('#schemaHolder').dialog();
									
								},
								'取消': function() {
									$(this).dialog('close');
								},
								'保存': function() {

									saveSchema(0, function(data) {
										if(data.status != 1) alert('保存失败！');
										if (data.status == 1) {
											$callAPI.getCombinations({});
											$tool.cacheCurrentSchema(data.list);
											$tool.action = 'edit';
											alert('保存成功，可在搭配列表中查看！');
										}
									});
									$(this).dialog('close');
									
								},
								'提交审核': function() {
									saveSchema(1, function(data) {
										if(data.status != 1) alert('提交失败！');
										if (data.status == 1) {
											$callAPI.getCombinations({});
											$tool.cacheCurrentSchema(data.list);
											$tool.action = 'edit';
											alert('提交成功，可在搭配列表中查看！');
										}
									});
									$(this).dialog('close');
									
								}
							}
						});
					}

					function saveSchema(edit_status, callback) {

						$tool.descriptionEditor.sync();
						$tool.mobileDescriptionEditor.sync();
						
						var $schemaHolder = $('#schemaHolder'),
							$areas = $schemaHolder.find('.area input:checked');
						var schemaName = $schemaHolder.find('.schema-name').val(),
							style = $schemaHolder.find('.style').val(),
							space = $schemaHolder.find('.space').val(),
							file360 = $schemaHolder.find('.file360').val(),
							//rebate = $schemaHolder.find('.rebate').val(),
							divide_money = $schemaHolder.find('.divide-money').text().slice(1);
							areaid = [];

						var description = $('#description').val(),
							mobileDescription = $('#mobileDescription').val();
						if ($areas.length) {
							for (var i = 0; i< $areas.length; i++) {
								areaid.push($areas.eq(i).attr('data-value'));
							}
						}
						//保存：0，提交审核：1
						param.edit_status = edit_status;
						param.action = $tool.action || 'add';
						param.name = schemaName;
						param.style = style;
						param.space = space;
						param.areaid = areaid;
						param.file360 = file360;
						//param.rebate = rebate;
						param.image_diy_base64 = dataURL;
						param.description = description;
						param.mobile_description = mobileDescription;

						if (param.action == 'edit') {
							param.old_goods_num = JSON.parse($('#schemaInfoHolder').data('old_goods_num'));
							param.mcid = $('#schemaInfoHolder').attr('data-mcid');
						}

						var programs = localStorage.getItem('programs');
						var obj = {};
						obj = $.extend(obj, param);
						delete obj.image_diy_base64;
						delete obj.goods_num;
						if (!programs) {
							programs = [obj];
						} else {
							var arr = JSON.parse(programs);
							arr.push(obj);
							programs = arr;
						}
						//localStorage.setItem('programs', JSON.stringify(programs));
						api.saveSchema({infodata: JSON.stringify(param)}, function(data) {
							callback(data);
						});
					}
					Array.prototype.forEach.call(cloneArr, function(obj) {
						loadimg(obj);
					});
					
				}
			});
			//打开设计方案
			common.event({
				obj: '#combinations .open',
				eventType: 'click',
				fn: function($this) {
					var id = $($this).attr('data-mcid');
					if (!navigator.onLine) {
						var schemas = localStorage.getItem('programs');
			        	if (schemas) {
			        		schemas = JSON.parse(schemas);
			        		schemas.forEach(function(schema) {
			        			if (schema.id == id) {
			        				$callAPI.showSchema(schema);
			        			}
			        		});			        		
			        	}
					} else {
						api.getSchema({mcid: id}, function(data) {
							if (data.status == 1) {
								var list = data.list;
								$callAPI.showSchema(list);	
								var areaid = list.areaid;
								if (areaid) {
									areaid = areaid.join(',');
								} else {
									areaid = '';
								}
								$('#schemaInfoHolder').attr({
									'data-name': list.name,
									'data-space': list.space,
									'data-mcid': list.mcid,
									'data-style': list.style,
									'data-area': areaid,
									'data-price': list.price,
									'data-pricesale': list.price_sale,
									'data-pricemarket': list.price_market,
									'data-rebate': list.rebate,
									'data-file360': list.file360
								}).data('old_goods_num', JSON.stringify(list.old_goods_num));
								$('#description').val(list.description);
								$('#mobileDescription').val(list.mobile_description);
								var $schemaInfoHolder = $('#schemaInfoHolder');
								var name = $schemaInfoHolder.attr('data-name');
								if (name) {
									var area = [];
									if (areaid) {
										area = areaid.split(',');
									}
									var $schemaHolder = $('#schemaHolder');
									$schemaHolder.find('.schema-name').val(list.name);
									$schemaHolder.find('.style').val(list.style);
									$schemaHolder.find('.rebate').val(list.rebate);
									$schemaHolder.find('.file360').val(list.file360);
									//$schemaHolder.find('.price').text('¥' + price);
									if (area.length) {
										var $areaCheck = $schemaHolder.find('.area input'),
											$label = $schemaHolder.find('.area label');
										$areaCheck.prop('checked', false);
										$label.removeClass('active');
										for (var i = 0; i< $areaCheck.length; i++) {
											var val = $areaCheck.eq(i).attr('data-value');
											for (var j = 0; j < area.length; j++) {
												if (area[j] == val) {
													$areaCheck.eq(i).prop('checked', true);
													$label.eq(i).addClass('active');
												}
											}
										}
									}
									if (list.space) {
										$schemaHolder.find('.space').val(list.space);
									}
									$tool.action = 'edit';
								} else {
									$tool.action = 'add';
								}


							} else {
								console.error('status:', data.status);
							}			
						});
					}
				}
			});
			//提交审核
			common.event({
				obj: '#combinations .docommit',
				eventType: 'click',
				fn: function($this) {
					var id = $($this).attr('data-mcid');
					if (navigator.onLine) {
						api.editSchema({mcid: id}, function(data) {
							if (data.status == 1) {
								alert('提交成功！');
								$callAPI.getCombinations({});
							}
						});
					} else {
						alert('网络中断，无法提交审核！');
					}
				}
			})
			//方案搜索
			common.event({
				obj: '.schema-search',
				eventType: 'click',
				fn: function($this) {
					var option = {}, keyword = $($this).siblings('.input-search').val();
					var edit_status = $($this).siblings('.edit-status').val();
					if (edit_status != 'all') {
						option.edit_status = edit_status;
					}
					if (keyword) {
						option.keyword = keyword;
					}
					$callAPI.getCombinations(option);
				}
			});
			//面包屑处理
			common.event({
				obj: '.level-to',
				eventType: 'click',
				fn: function($this, e) {
					var $this = $($this);
					var dataLevel = $this.attr('data-level');
					if (dataLevel == 1) {
						$callAPI.parentid = null;
						$callAPI.catid = null;
						$callAPI.areaid = null;
					}
					$this.parents('.tab-panel').find('.levels:nth-child('+$this.attr('data-level')+')').show().siblings().hide();
				}
			});
		},
		animateFavorite: function(target) {
			target.animate({
				position:'relative',
				top: '-100px',
				opacity: 0
			}, 300, function() {
				$(this).remove();
			});
		},
		searchProducts: function(keyword, $holder) {
			/*var crumb = api.getCrumb({title1: keyword, toolbar: true});
			$holder.find('.crumbs, .toolbar').remove().end().prepend(crumb);*/
			$holder.find('.crumbs a:last-child').text(keyword);
			var option = {};
			option.keyword = keyword;
			option.num = api.config.PAGENUM;
			if ($callAPI.parentid) {
				option.parent_catid = $callAPI.parentid;
			}
			if ($callAPI.catid) {
				option.catid = $callAPI.catid;
			}
			if ($callAPI.areaid) {
				option.areaid = $callAPI.areaid;
			}
			$callAPI.getProducts(option, $holder.find('.content')[0]);
		},
		getCombinations: function(option, target, cb) {
			option.num = 6;
			api.getCombinations(option, function(html, data) {
				$('#combinations .content').html(html);
				var target = $('#combinations .content')[0];
				new Pagenation({
					total: parseInt(data.total),
					page: parseInt(data.page),
					num: parseInt(data.num),
					option: option,
					target: target,
					callback: $callAPI.getCombinations
				});
				if (cb) {
					cb();
				}
			});
		},
		getCategory: function(option) {
			api.getCategory(option, function(html, data) {
	    		$('#products .levels:first-child .content').html(html);
	    		//解决IE的奇葩现象
	    		if (/IE/g.test(window.navigator.userAgent)) {
		    		$('#products').find('.box').css({display: 'block', width: '100%'});
		    	}
	    	});
		},
		getProducts: function(option, target) {
			api.getProducts(option, function(html, data) {
				target.innerHTML = html;
				new Pagenation({
					total: parseInt(data.total),
					page: parseInt(data.page),
					num: parseInt(data.num),
					option: option,
					target: target,
					callback: $callAPI.getProducts
				});
				$('.move').tooltipster({
					content: 'Loading...',
					functionBefore: function(origin, continueTooltip) {
						continueTooltip();
							var html = api.getProductDetail({proid: $(origin).attr('data-proid'), goods_id: $(origin).attr('data-goodsid')}, $(origin).attr('id'), function(html) {
								origin.tooltipster('content', html);
							});
					},
					contentAsHTML: true,
					speed: 0,
					trigger: 'click'
				});
			});
		},
		getSubCategory: function(option, target) {
			api.getSubCategory(option, function(html, data) {
	    		target.innerHTML = html;
	    	});
		}
	};
	$callAPI.init();
	return $callAPI;
});