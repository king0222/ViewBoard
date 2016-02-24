define(['jquery', 'ux/ux-template'],function($, $template){
	
	var API = function() {
		var category = null;
		/*var config = {
			PAGENUM: 10,
			getCategory: '/design/data/category.json',
			getProducts: '/design/data/products.json',
			getBackgrounds: '/design/data/backgrounds.json',
			getFavorites: '/design/data/favorites.json',
			getMaterials: '/design/data/materials.json',
			getCombinations: '/design/data/combinations.json',
			getPerspectives: '/design/data/perspectives.json',
			deleteFavorite: '/design/data/delete.json',
			deleteMaterial: '/design/data/delete.json'
		};*/
		var config = {
			PAGENUM: 24,
			getCategory: '/design-getCategroylist.html',
			getProducts: '/design-getProductlist.html',
			getBackgrounds: '/design-getDiybackground.html',
			getFavorites: '/?c=design&a=getFavoritelist',
			handleFavorite: '/?c=design&a=favoriteHandle',
			getMaterials: '/design/data/materials.json',
			getCombinations: '/?c=design&a=getMatchList',
			getSchema: '/?c=design&a=getMatchDiyInfo',
			editSchema: '/?c=design&a=setMatchEditStatus',
			getPerspectives: '/?c=design&a=getDiyproduct',
			deleteFavorite: '/design/data/delete.json',
			deleteMaterial: '/design/data/delete.json',
			productFilter: '/design-getDatainfo.html',
			saveSchema: '/?c=design&a=saveMatchHandle',
			sizeList: '/?c=design&a=getSizelist'
		};

		var ajax = function(options) {
			var data = {
				t: new Date().getTime()
			};
			if(options.data) {
				data = $.extend({}, data, options.data);
			};
			$.ajax({
				url: options.url,
				data: data,
				type: options.type || 'GET',
				beforeSend: options.beforeSend || null,
				complete: options.complete || null,
				success: function(data) {
					if (options.success) {
						options.success(data);	
					}				
				},
				error: function(err) {
					console.error('ux-api call error!');
					if (options.error) {
						options.error(err);
					}
				}
			});
		};
		
		return {
			config: config,
			getCategory: function(data, done) {
				ajax({
					url: config.getCategory,
					data: data,
					beforeSend: function() {
						$('#loading').show();
					},
					success: function(data) {
						category = data.list;
						var html = $template.category(data);
						if (done) {
							done(html, data);
						}
					},
					complete: function() {
						$('#loading').fadeOut();
					}
				});
			},
			getSubCategory: function(data, done) {
				ajax({
					url: config.getCategory,
					data: data,
					beforeSend: function() {
						$('#loading').show();
					},
					success: function(data) {
						var html = $template.subCategory(data);
						if (done) {
							done(html, data);
						}
					},
					complete: function() {
						$('#loading').fadeOut();
					}
				});
			},
			getProducts: function(data, done) {
				ajax({
					url: config.getProducts,
					data: data,
					beforeSend: function() {
						$('#loading').show();
					},
					success: function(data) {
						var html = $template.products(data);
						if (done) {
							done(html, data);
						}
					},
					complete: function() {
						$('#loading').fadeOut();
					}
				});
			},
			getBackgroundCategory: function(data, done) {
				var html = $template.backgroundCategory(data);
				if (done) {
					done(html, data);
				}
			},
			getBackgrounds: function(data, done) {
				ajax({
					url: config.getBackgrounds,
					data: data,
					beforeSend: function() {
						$('#loading').show();
					},
					success: function(data) {
						var html = $template.backgrounds(data);
						if (done) {
							done(html, data);
						}
					},
					complete: function() {
						$('#loading').fadeOut();
					}
				});
			},
			getFavorites: function(data, done) {
				ajax({
					url: config.getFavorites,
					data: data,
					success: function(data) {
						var html = $template.favorites(data);
						if (done) {
							done(html, data);
						}
					}
				});
			},
			handleFavorite: function(data, done) {
				ajax({
					url: config.handleFavorite,
					data: data,
					success: function(data) {
						if (done) {
							done(data);
						}
					}
				});
			},
			getMaterials: function(done) {
				ajax({
					url: config.getMaterials,
					success: function(data) {
						var html = $template.favorites(data);
						if (done) {
							done(html, data);
						}
					}
				});
			},
			getCombinations: function(data, done) {
				ajax({
					url: config.getCombinations,
					data: data,
					success: function(data) {
						var html = $template.combinations(data);
						if (done) {
							done(html, data);
						}
					}
				});
			},
			getSchema: function(data, done) {
				ajax({
					url: config.getSchema,
					data: data,
					success: function(data) {
						if (done) {
							done(data);
						}
					}
				});
			},
			editSchema: function(data, done) {
				ajax({
					url: config.editSchema,
					data: data,
					success: function(data) {
						if (done) {
							done(data);
						}
					}
				});
			},
			getCombinationsOffline: function(data, done) {
				var html = $template.combinations(data);
				if (done) {
					done(html, data);
				}
			},
			getPerspectives: function(data, done) {
				ajax({
					url: config.getPerspectives,
					data: data,
					success: function(data) {
						var perspectHtml = $template.perspectives(data),
							detailHtml = $template.details(data),
							cropPerspectHtml = $template.cropPerspect(data);
						if (done) {
							done(perspectHtml, detailHtml, cropPerspectHtml);
						}
					}
				});
			},
			deleteMaterial: function(data, done) {
				ajax({
					url: config.deleteMaterial,
					data: data,
					success: function(data) {
						if (done) {
							done(data);
						}
					}
				});
			},
			getCrumb: function(data) {
				var html = $template.crumb(data);
				return html;
			},
			getProductFilter: function(done) {
				ajax({
					url: config.productFilter,
					success: function(data) {
						var productFilter = $template.productFilter(data),
							areas = $template.areas(data),
							styles = $template.styles(data),
							matchStyles = $template.matchStyles(data);
						if (done) {
							done(productFilter, areas, styles, matchStyles, data);
						}
					}
				});	
			},
			saveSchema: function(data, done) {
				ajax({
					url: config.saveSchema,
					data: data,
					type: 'POST',
					success: function(data) {
						done(data);
					}
				});
			},
			getSizeList: function(data, done) {
				ajax({
					url: config.sizeList,
					data: data,
					success: function(data) {
						var html = $template.sizeList(data);
						if (done) {
							done(html, data);
						}
					}
				});
			},
			getProductDetail: function(data, id, done) {
				ajax({
					url: config.getPerspectives,
					data: data,
					success: function(data) {
						if (data && data.list) {
							data.list[0]['data_id'] = id;
						}
						var productDetail = $template.productDetail(data);
						if (done) {
							done(productDetail, data);
						}
					}
				});
			}
		};
	};

	return API();
});