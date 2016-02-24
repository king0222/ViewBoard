define([],function(){
	/**usage:
	var pagenation = new Pagenation(options);
	var dom = pagenation.nav;
	*/
	var Pagenation = function(options) {
		this.target = options.target;
		this.currentPage = options.page; //当前页
		this.total = options.total; //总条数
		this.num = options.num; //每页展示多少条
		this.callback = options.callback;
		this.option = options.option,
		this.createPagenation();
	};

	Pagenation.prototype.createPagenation = function() {
		var self = this;
		if (self.total <= self.num || self.num == 0) {
			return false;
		}
		var nav = document.createElement('nav');
		var ul = document.createElement('ul');
		ul.setAttribute('class', 'clearfix');

		var pli = document.createElement('li'),
			pa = document.createElement('a');
		pli.setAttribute('class', 'pre-page');
		pa.setAttribute('title', '上一页');
		pli.appendChild(pa);
		ul.appendChild(pli);

		var createLi = function(text, tag) {
			var li = document.createElement('li'),
				a = document.createElement('a'),
				text = document.createTextNode(text);
			a.appendChild(text);
			li.appendChild(a);
			if (tag) {
				li.setAttribute('class', 'page current');
			} else {
				li.setAttribute('class', 'page');	
			}
			return li;
		}

		var beforeTag = true, afterTag = true, cut = 2;
		for (var i = 0, j = Math.ceil(this.total / this.num); i < j; i++) {
			if (j > 7 && i > cut - 1 && i < j - cut)  {
				if (this.currentPage > cut && this.currentPage <= j - cut) {
					if (i === self.currentPage - 1 && self.currentPage === cut + 1) {
						var li = createLi(i + 1, true),
							li2 = createLi('...');
						ul.appendChild(li);
						ul.appendChild(li2);
						beforeTag = false;
						afterTag = false;
					} else{
						if (self.currentPage === j - cut) {
							if (i === self.currentPage - 1) {
								var li = createLi(i + 1, true),
									li2 = createLi('...');
								ul.appendChild(li2);
								ul.appendChild(li);
								beforeTag = false;
								afterTag = false;
							} 
						} else {
							if (beforeTag) {
								var li = createLi(self.currentPage, true),
									li2 = createLi('...'),
									li3 = createLi('...');
								ul.appendChild(li2);
								ul.appendChild(li);
								ul.appendChild(li3);
								beforeTag = false;
								beforeTag = false;
							}
						}
					}
				} else {
					if (afterTag) {
						var li = document.createElement('li'),
							a = document.createElement('a'),
							text = document.createTextNode('...');
						a.appendChild(text);
						li.appendChild(a);
						ul.appendChild(li);	
						afterTag = false;
					}
				}
			} else {
				var li = document.createElement('li');
				var a = document.createElement('a');
				var text = document.createTextNode(i + 1);
				if (this.currentPage === (i + 1)) {
					li.setAttribute('class', 'page current');	
				} else {
					li.setAttribute('class', 'page');	
				}			
				li.setAttribute('data-page', i + 1);
				a.appendChild(text);
				li.appendChild(a);
				ul.appendChild(li);	
			}
			
		}

		var nli = document.createElement('li'),
			na = document.createElement('a')
		nli.setAttribute('class', 'next-page');
		na.setAttribute('title', '下一页');
		nli.appendChild(na);
		ul.appendChild(nli);

		var li = document.createElement('li');
		var input = document.createElement('input');
		input.setAttribute('class', 'page-num');
		var button = document.createElement('button');
		var btnText = document.createTextNode('GO');
		button.setAttribute('class', 'go-page');
		button.appendChild(btnText);
		li.appendChild(input);
		li.appendChild(button);
		ul.appendChild(li);

		nav.appendChild(ul);
		nav.setAttribute('class', 'pagenation');
		this.nav = nav;
		if (this.target) {
			this.target.appendChild(nav);
		}
		this.initEvent();
	};

	Pagenation.prototype.initEvent = function() {
		var self = this;
		var pages = self.nav.querySelectorAll('.page');
		Array.prototype.forEach.call(pages, function(page) {
			page.onclick = function() {
				self.goPage(this.getAttribute('data-page'));
			};
		});
		
		self.nav.querySelector('.pre-page').onclick = function() {
			self.prePage();
		};
		self.nav.querySelector('.next-page').onclick = function() {
			self.nextPage();
		};
		self.nav.querySelector('.go-page').onclick = function() {
			var page = self.nav.querySelector('.page-num').value;
			self.goPage(page);
		};
	};

	Pagenation.prototype.prePage = function() {
		if (this.currentPage < 2) {
			return false;
		}
		this.option['page'] = this.currentPage - 1;
		this.callback(this.option, this.target);
	};

	Pagenation.prototype.nextPage = function() {
		if (this.currentPage >= Math.ceil(this.total / this.num)) {
			return false;
		}
		this.option['page'] = this.currentPage + 1;
		this.callback(this.option, this.target);
	};

	Pagenation.prototype.goPage = function(page) {
		if (!page) {
			return false;
		}
		if (page < 1 || page > Math.ceil(this.total / this.num)) {
			alert('请输入大于0且小于'+Math.ceil(this.total / this.num)+'的整数！');
			return false;
		}
		this.option['page'] = page;
		this.callback(this.option, this.target);
	};

	return Pagenation;
});