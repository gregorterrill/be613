;(function($, Modernizr, window, document, undefined) {

	//-----------------------------------------------------------------[ HELPER FUNCTIONS ]
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	//-----------------------------------------------------------------[ REQUESTANIMATIONFRAME POLYFILL FOR IE9 ]
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license

	if (!Modernizr.requestanimationframe) {
		(function() {
		    var lastTime = 0;
		    var vendors = ['ms', 'moz', 'webkit', 'o'];
		    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
		                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
		    }
		 
		    if (!window.requestAnimationFrame)
		        window.requestAnimationFrame = function(callback, element) {
		            var currTime = new Date().getTime();
		            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
		              timeToCall);
		            lastTime = currTime + timeToCall;
		            return id;
		        };
		 
		    if (!window.cancelAnimationFrame)
		        window.cancelAnimationFrame = function(id) {
		            clearTimeout(id);
		        };
		}());
	}

	//-----------------------------------------------------------------[ SMOOTH SCROLL TO ANCHORS ]
	$('a[href^="#"]').click(function(e) {
		e.preventDefault();
		var target = $(this).attr('href');
		if (target === '#') return;
		if ($(target).length) {
			//scroll to target
			$('html, body').stop().animate({
				scrollTop: $(target).offset().top - 70
			}, 600);
			$(this).blur();
		}
	});

	//-----------------------------------------------------------------[ NAV TOGGLE ]
	$('.js-nav-toggle').click(function(e) {
		$('.site-nav').toggleClass('is-open');
		$('body').toggleClass('nav-open');
		$(this).blur();
	});

	//-----------------------------------------------------------------[ END ]

})(jQuery, Modernizr, window, document);