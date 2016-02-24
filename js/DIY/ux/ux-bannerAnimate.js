define([], function() {
	var BannerAnimate = function(selector) {
		var width, height, canvas, ctx, circles, animateHeader = true;

    	this.init = function() {
    		initHeader();
	    	addListeners();
    	}		    
	    

	    function initHeader() {
	        canvas = document.getElementById(selector);
	        ctx = canvas.getContext('2d');


	        width = canvas.offsetWidth;
	        height = canvas.offsetHeight;
	        canvas.width = width;
	        canvas.height = height;
	        circles = [];

	        for(var x = 0; x < width*0.05; x++) {
	            var c = new Circle();
	            circles.push(c);
	        }
	        animate();
	    }

	    function addListeners() {
	        window.addEventListener('scroll', scrollCheck);
	        window.addEventListener('resize', resize);
	    }

	    function scrollCheck() {
	        if(document.body.scrollTop > height) animateHeader = false;
	        else animateHeader = true;
	    }

	    function resize() {
	    	width = canvas.offsetWidth;
	    	height = canvas.offsetHeight;
	    	canvas.width = width;
	    	canvas.height = height;
	    }

	    function animate() {
	        if(animateHeader) {
	            ctx.clearRect(0,0,width,height);
	            for(var i in circles) {
	                circles[i].draw();
	            }
	        }
	        requestAnimationFrame(animate);
	    }

	    function getRandomColor(rgba) {
	    	if (rgba) {
	    		return 'rgba(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + Math.random() + ')';
	    	} else {
	    		return '#' + (function(color) {
	                return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color); 
	            })('');
	    	}
        }

	    function Circle() {
	        var _this = this;

	        (function() {
	            _this.pos = {};
	            init();
	        })();

	        function init() {
	            _this.pos.x = Math.random()*width;
	            _this.pos.y = height+Math.random()*100;
	            _this.alpha = 0.1+Math.random()*0.3;
	            _this.scale = 0.1+Math.random()*0.3;
	            _this.velocity = Math.random();
	            _this.color = 'rgba(255,255,255,' + _this.alpha + ')';
	        }

	        this.draw = function() {
	            if(_this.alpha <= 0) {
	                init();
	            }
	            _this.pos.y -= _this.velocity;
	            _this.alpha -= 0.0005;
	            ctx.beginPath();
	            ctx.arc(_this.pos.x, _this.pos.y, _this.scale*10, 0, 2 * Math.PI, false);
	            ctx.fillStyle = _this.color;
	            ctx.fill();
	        };
	    }
	};
	return BannerAnimate;
});