(function($, fnFrontend){
	"use strict";
	
	
	
	var FrenifyAiland = {
		
		isAdmin: false,
		adminBarH: 0,
		
		ajaxClicksForAjaxGridPosts: 0,
		
		init: function() {
			
			if($('body').hasClass('admin-bar')){
				FrenifyAiland.isAdmin 		= true;
				FrenifyAiland.adminBarH 	= $('#wpadminbar').height();
			}

			var widgets = {
				'frel-marquee.default' : FrenifyAiland.marquee,
				'frel-images.default' : FrenifyAiland.floww,
				'frel-testimonials.default' : FrenifyAiland.testimonials,
				'frel-video.default' : FrenifyAiland.video,
				'frel-interactive-list.default' : FrenifyAiland.interactiveList,
				'frel-pricing-tables.default' : FrenifyAiland.pricingTab,
				'frel-call-to-action.default' : FrenifyAiland.callToAction,
				'frel-interactive-full.default' : FrenifyAiland.flickitySlider,
			};

			$.each( widgets, function( widget, callback ) {
				fnFrontend.hooks.addAction( 'frontend/element_ready/' + widget, callback );
			});
		},
		
		
		
		flickitySlider: function(){
			FrenifyAiland.BgImg();
			var interactiveFlickity		= $('.fn_cs_flickity_slider');
			interactiveFlickity.each(function(){
				var element		= $(this);
				element.on( 'ready.flickity', function() {
					FrenifyAiland.flickityCallBack(element);
				});
				var $carousel	= element.find('.slider_wrap ul').flickity({
					cellAlign: 'center',
					draggable: true,
					pageDots: false,
					prevNextButtons: '',
				});
				$carousel.on( 'dragEnd.flickity', function() {
					FrenifyAiland.flickityCallBack(element);
				});
			});
			
		},
		
		
		flickityCallBack: function(element){
			var index 	= element.find('.slider_wrap ul li.is-selected').index();
			var allLi	= element.closest('.fn_cs_flickity_slider').find('.main_bg_image ul li');
			var sameLi	= element.closest('.fn_cs_flickity_slider').find('.main_bg_image ul li:nth-child('+(index+1)+')');
			allLi.removeClass('active');
			sameLi.addClass('active');
			if(allLi.find('video').length){
				allLi.find('video').get(0).pause();
			}
			if(sameLi.hasClass('video')){
				if(sameLi.find('video').length){
					sameLi.find('video').get(0).play();
				}
			}
		},
		
		getRandomFromArray: function (array) {
		  return array[Math.floor((Math.random() * array.length))];
		},
		
		callToAction: function(){
			$('.fn_cs_calltoaction [data-mcount="4+"]').each(function(){
				var e = $(this),
					p = e.closest('.fn_cs_calltoaction'),
					tpItems = p.find('.tp_item'),
					length = tpItems.length;
				var arr = [0,1,2,3];
				var arr2 = [];
				for(var i = 0; i < length; i++){
					arr2.push(i);
				}
				var arr3 = [];
				setInterval(function(){
					arr3 = arr2.filter(item => !arr.includes(item));
					var myr = FrenifyAiland.getRandomFromArray(arr3);
					var r = Math.floor((Math.random() * arr.length));
					
					e.find('.img_item').eq(r).find('.abs_img').css({backgroundImage: 'url('+tpItems.eq(myr).data('img')+')'});
					arr[r] = myr;
				},2000);
			});
		},
		
		pricingTab: function(){
			$('.fn_cs_pricing .toggle_in').each(function(){
				var element = $(this),
					active = element.find('.active');
				var offset = active.offset().left - element.offset().left;
				element.find('.bg').css({left: offset, width: active.outerWidth(true,true)});
			});
			$('.fn_cs_pricing .toggle_in a').off().on('click',function(){
				var element = $(this);
				if(!element.hasClass('active')){
					var parent = element.closest('.toggle_in');
					var pricing = element.closest('.fn_cs_pricing');
					var offset = element.offset().left - parent.offset().left;
					pricing.find('.pricing__tab.active').removeClass('active');
					$(element.attr('href')).addClass('active');
					element.siblings().removeClass('active');
					element.addClass('active');
					parent.find('.bg').css({left: offset, width: element.outerWidth(true,true)});
				}
				return false;
			});
		},
		
		interactiveList: function(){
			var e = $(".frenify-portfolio-interactive-showcase");

			if (e) {
				e.each(function() {
					FrenifyAiland.il__init($(this));
					FrenifyAiland.il__transition($(this));
				});
			}
			FrenifyAiland.BgImg();
		},
		
		il__init: function(e){
			var o = e.find(".frenify-e");
			if (o.length) {
				o.on("mousemove", function() {
					var e = $(this);
					o.removeClass("frenify--active");
					e.addClass("frenify--active");
				}).on("mouseleave", function() {
					o.removeClass("frenify--active");
				});

				e.addClass("frenify--init");
			}
		},
		
		il__transition: function(e){
		 	var o = e.find(".frenify-e-follow-content .frenify-e-follow-image");
			var e = e.find(".frenify-e");
			var r = [];

			if (o.length) {
				o.each(function(e) {
					var o = $(this).find("svg").find("filter");
					var t = o.attr("id");
					var i = o.find("feDisplacementMap")[0];
					var n = { val: 0 };

					r[e] = gsap.timeline({
						paused: true,
						force3d: true,
						onStart: () => {
							gsap.set($(this), {
								filter: "url(#" + t + ")"
							});
						},
						onReverseComplete: () => {
							gsap.set($(this), {
								filter: "none"
							});
						},
						onUpdate: () => {
							i.setAttribute("scale", n.val);
						}
					});

					r[e].addLabel("start", ".18").fromTo($(this), {
						opacity: 0,
						y: -40
					}, {
						opacity: 1,
						y: 0,
						z: 1,
						duration: 0.32
					}, "start").to(n, {
						startAt: {
							val: 120
						},
						val: 0,
						duration: 0.55
					}, "start");
				});
			}

			if (e.length) {
				e.each(function(e) {
					var el = $(this);
					el.on("mouseenter", function() {
						r[e].timeScale(1).play();
//						var a = parseInt((400 / el.find('.text').width()) * 100);
//						var b = (100 - a)/2;
//						$('#frenify-clipp').width(el.find('.text').width());
//						$('#frenify-clip-1').attr('width',b+'%');
//						$('#frenify-clip-2').attr('width',b+'%');
//						$('#frenify-clip-2').attr('x',(100-b)+'%');
						// disabled canvas animation
					}).on("mouseleave", function() {
						r[e].timeScale(2).reverse();
					});
				});
			}
		},
		
		isElementInViewport: function(el){
			var rect = el[0].getBoundingClientRect();
			return (
			  rect.top >= 0 &&
			  rect.left >= 0 &&
			  rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			  rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		},
		
		getRandomPosition: function (max) {
            return Math.floor(Math.random() * max) + 'px';
        },
		
		
		video: function(){
			var minwidth = 60;
			$('.fn_cs_video').each(function() {
				var element = $(this);
				$(window).on("scroll resize", function() {
					var view = element.isInViewportByFrenify2();
					var x;
					if (view[0]) {
						x = (40 * view[1])  / ($(window).height() * 0.8);
						if(x > 100){x = 100;}
						element.find('.container').css({maxWidth: minwidth + x + '%'});
					}
			  });
//				var $icon = element.find('.video_icon .icon');
//				var $dot = element.find('.video_icon .dot');
//				var tt,ll;
//				setInterval(function(){
//					tt = FrenifyAiland.getRandomPosition(element.height() - $icon.height());
//					ll = FrenifyAiland.getRandomPosition(element.width() - $icon.width());
//					$icon.css({top: tt,left:  ll});
//					$dot.css({top: tt,left:  ll});
//				}, 3500);
				
			});
			FrenifyAiland.BgImg();
		},
		
		
		testimonials: function(){
			$('.fn_cs_testimonials .owl-carousel').each(function(){
				var e		= $(this);
				var p 		= e.closest('.fn_cs_testimonials');
				
				e.owlCarousel({
					loop: true,
					items: 1,
					lazyLoad: true,
					autoplay: true,
					autoplayTimeout: 7000,
					smartSpeed: 2000,
					margin: 100,
					dots: false,
					autoHeight: true,
					nav: false,
					navSpeed: true,
					responsive : {
						0 : {
							mouseDrag: false,
							touchDrag: true,
						},
						1100 : {
							mouseDrag: true,
							touchDrag: true,
						}
					}
				});
				FrenifyAiland.ImgToSVG();
				e.on('changed.owl.carousel', function() {
					FrenifyAiland.ImgToSVG();
				});
				p.find('.fn_nav .prev').off().on('click',function(){
					e.trigger('prev.owl.carousel', [1500]);
					e.trigger('stop.owl.autoplay');
					e.trigger('play.owl.autoplay');
					
					return false;
				});
				p.find('.fn_nav .next').off().on('click',function(){
					e.trigger('next.owl.carousel');
					e.trigger('stop.owl.autoplay');
					e.trigger('play.owl.autoplay');
					return false;
				});
			});	
		},
		
		marquee: function(){
			$(".fn_cs_marqueetext .marquee").each(function(){
				var e = $(this);
				var direction = e.data('direction');
				if(!e.hasClass('ready')){
					e.addClass('ready').marquee({
						duplicated: true,
						duration: 17*1000,
						delayBeforeStart: 0,
						direction: direction,
//						pauseOnHover: true,
						startVisible: true
					});
				}
			});	
		},
		
		fn_cs_images_mosaic: function(){
			$('.fn_cs_images_mosaic').each(function(){
				var e = $(this),
					w = e.width(),
					hgap = e.data('hgap'),
					vgap = hgap,
					r;
				if(w > 1200){
					r = 6;
				}else {
					r = 3;
				}
				w = w - (r-1)*vgap;
				var www = ((2 * w / r) - hgap * (-1) * (r-1))/2;
				var www2 = ((2 * w / r) - hgap * (r-1))/2;
				
				var itemsPerDiv = r;
				var $list = e.find('.listt');
				var $items = $list.children('li');

				// Create div containers and append items
				for (var i = 0; i < $items.length; i += itemsPerDiv) {
					var $div = $('<div class="item-group"></div>');
					var $ul = $('<ul></ul>');
					$items.slice(i, i + itemsPerDiv).appendTo($ul);
					$ul.appendTo($div);
					$div.appendTo(e);
				}

				// Remove the original ul
				$list.remove();
				
				e.find('.item-group:even').each(function(){
					$(this).find('li').each(function(){
						var li = $(this);
						li.css({width: (www + (li.index()%r)*hgap*(-1))/w * 100 + '%'});
					});
				});
				
				e.find('.item-group:odd').each(function(){
					$(this).find('li').each(function(){
						var li = $(this);
						li.css({width: (www2 + (li.index()%r)*hgap) / w * 100 + '%'});
					});
				});
			});
		},
		
		floww: function(){
			FrenifyAiland.fn_cs_images_mosaic();
			FrenifyAiland.BgImg();
			$('.fn_cs_images_cards').each(function(){
				var element 		= $(this),
					ul				= element.find('ul'),
					children		= ul.children('li'),
					length			= children.length;
				if(!element.hasClass('ready')){
					element.addClass('ready');
					// stop function
					if(length<5){return false;}

					// build gallery slider
					FrenifyAiland.floww_change_slide(1,element);

					// item click function
					children.on('click',function(){
						var el 			= $(this);
						var index		= el.index() + 1;
						FrenifyAiland.floww_change_slide(index,element);
					});
					FrenifyAiland.floww_start_autoplay(ul,element);
				}
			});
		},

		/* since v4.0 */
		floww_start_autoplay: function(ul,element){
			var timeout 		= 5000;
			var time 			= null;
			clearInterval(time);
			time = setInterval(function(){
				var index 		= ul.find('.current').index() + 2;
				FrenifyAiland.floww_change_slide(index,element);
			}, timeout);
		},
		
		/* since v4.0 */
		floww_change_slide: function(index, element){
			var ul 				= element.find('ul'),
				children 		= ul.children('li'),
				length			= children.length;
				index			= (index + length) % length;
			var el 				= children.eq(index-1);

			if(!el.hasClass('current')){
				children.removeClass('current next1 next2 prev1 prev2 next3 prev3');
				el.addClass('current');
				var next1_index = (index + 1) % length;
				var next2_index = (index + 2) % length;
				var next3_index = (index + 3) % length;
				var prev1_index = (index - 1 + length) % length;
				var prev2_index = (index - 2 + length) % length;
				var prev3_index = (index - 3 + length) % length;
				children.eq(next1_index-1).addClass('next1');
				children.eq(next2_index-1).addClass('next2');
				children.eq(prev1_index-1).addClass('prev1');
				children.eq(prev2_index-1).addClass('prev2');
				if(length > 6){
					children.eq(next3_index-1).addClass('next3');
					children.eq(prev3_index-1).addClass('prev3');
				}
				FrenifyAiland.floww_calc_call(element);
			}
		},
		
		generateNthrow: function (row) {
			var sequence = [];
			var length = row * 2 - 1;

			for (var i = 1; i <= length; i++) {
			  var value;
			  if (i <= row) {
				value = i;
			  } else {
				value = length - i + 1;
			  }
			  sequence.push(value-1);
			}

			return sequence;
		},
		
		/* since v4.0 */
		flow_calc: function(element){
			var w 				= element.width(),
				hgap 			= element.data('hgap'),
				vgap 			= element.data('vgap'),
				ratio 			= element.data('ratio'),
				items			= 3,
				b,widthLocal,widthGlobal;
			var ul				= element.find('ul');
			if(w> 1200){items = 5;}
			if(items === 5){
				b = vgap * 4;
			}else if(items === 3){
				b = vgap * 1;
			}
			var width = (w-(items-1)*hgap - b)/items;
			var pascal = FrenifyAiland.generateNthrow(parseInt(items/2)+1);
			
			var leftOffset = 0;
			var topOffset = 0;
			var center = Math.floor(items / 2)+1,prefix;
			widthGlobal = width + pascal[center-1]*vgap;
			for(var i = 1; i < items+1; i++){
				if(i < center){
					prefix = '.prev'+(center-i);
				}else if(i === center){
					prefix = '.current';
				}else{
					prefix = '.next'+(i-center);
				}
				widthLocal = width + pascal[i-1]*vgap;
				topOffset = (widthGlobal*ratio - widthLocal*ratio) / 2;
				ul.find(prefix).css({width: widthLocal, height: widthLocal*ratio, left: leftOffset, transform: 'scale(1)', top: topOffset});
				leftOffset+= widthLocal+hgap;
			}
			ul.height(widthGlobal*ratio + 'px');
		},

		/* since v4.0 */
		floww_calc_call: function(element){
			if(typeof element === 'undefined'){
				$('.fn_cs_images_cards').each(function(){
					element = $(this);
					FrenifyAiland.flow_calc(element);
				});
			}else{
				FrenifyAiland.flow_calc(element);
			}
		},
		
		
		
		/* COMMMON FUNCTIONS */
		BgImg: function(){
			var div = $('*[data-fn-bg-img]');
			div.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-fn-bg-img');
				var dataBg	= element.data('fn-bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					element.css({backgroundImage:'url('+dataBg+')'});
				}
			});
			var div2 = $('*[data-bg-img]');
			div2.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-bg-img');
				var dataBg	= element.data('bg-img');
				if(typeof(attrBg) !== 'undefined'){
					element.addClass('frenify-ready');
					element.css({backgroundImage:'url('+dataBg+')'});
				}
			});
		},
		
		ImgToSVG: function(){
			
			$('img.fn__svg').each(function(){
				var $img 		= $(this);
				var imgClass	= $img.attr('class');
				var imgURL		= $img.attr('src');

				$.get(imgURL, function(data) {
					var $svg = $(data).find('svg');
					if(typeof imgClass !== 'undefined') {
						$svg = $svg.attr('class', imgClass+' replaced-svg');
					}
					$img.replaceWith($svg);

				}, 'xml');
			});
		},
		
		jarallaxEffect: function(){
			$('.jarallax').each(function(){
				var element			= $(this);
				var	customSpeed		= element.data('speed');

				if(customSpeed !== "undefined" && customSpeed !== ""){
					customSpeed = customSpeed;
				}else{
					customSpeed 	= 0.5;
				}
				element.jarallax({
					speed: customSpeed,
					automaticResize: true
				});
			});
		},
		
		isotopeFunction: function(){
			var masonry = $('.fn_cs_masonry');
			if($().isotope){
				masonry.each(function(){
					$(this).isotope({
					  itemSelector: '.fn_cs_masonry_in',
					  masonry: {}
					});
					$(this).isotope( 'reloadItems' ).isotope();
				});
			}
		},
		
		lightGallery: function(){
			if($().lightGallery){
				// FIRST WE SHOULD DESTROY LIGHTBOX FOR NEW SET OF IMAGES
				var gallery = $('.fn_cs_lightgallery');

				gallery.each(function(){
					var element = $(this);
					element.lightGallery(); // binding
					if(element.length){element.data('lightGallery').destroy(true); }// destroying
					$(this).lightGallery({
						selector: ".lightbox",
						thumbnail: 1,
						loadYoutubeThumbnail: !1,
						loadVimeoThumbnail: !1,
						showThumbByDefault: !1,
						mode: "lg-fade",
						download:!1,
						getCaptionFromTitleOrAlt:!1,
					});
				});
			}	
		},
	};
	
	$( window ).on( 'elementor/frontend/init', FrenifyAiland.init );
	
	
	$( window ).on('resize',function(){
		FrenifyAiland.isotopeFunction();
		FrenifyAiland.interactiveList();
		setTimeout(function(){
			FrenifyAiland.isotopeFunction();
		},700);
	});
	$( window ).on('load',function(){
		FrenifyAiland.isotopeFunction();
	});
	
	$(window).on('scroll',function(){
		
	});
	
})(jQuery, window.elementorFrontend);