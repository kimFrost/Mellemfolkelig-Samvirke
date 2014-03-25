var ms;
(function(window,document,undefined){
	ms = {}
	ms.data = {}
	//private default parameter map
	ms.paramap = {
		complete: null,
		e: null,
		obj: null,
		json: null,
		array: null,
		boolean: null,
		string: null,
		index: null,
		value: null,
		special: null
	}	
/**---------------------------------------
	Function archive
---------------------------------------**/  
	// Init
	ms.init = function(options){
		var o = ms.extend(options);

		// Set init data
		ms.data.hotspots = [];
		ms.data.pages = [];
		ms.data.lightboxes = [];
		ms.data.view = {
			element: $('.l-content'),
			content: {
				element: $('.l-content-innerContent')
			},
			states: {
				active: false,
				activeTemplate: null
			},
			toggle: function() {
				if (this.states.active) {
					this.element.fadeOut(300);
					this.states.active = false;
				}
				else {
					this.element.fadeIn(300);
					this.states.active = true;
				}
			},
			show: function(){
				this.element.fadeIn(300);
				this.states.active = true;
			},
			hide: function(){
				if (this.states.active) {
					this.element.fadeOut(300);
					this.states.active = false;
					$(ms.data.pages).each(function(){
						this.deactivate();
					});
					$(ms.data.hotspots).each(function(){
						this.deactivate();
					});
				} 
			}
		}
		ms.data.sound = {
			player: {
				states: {}
			},
			control: {
				states: {}
			}
		}
		ms.data.panorama = {
			element: $('.panorama-view'),
			showControls: false,
			startPos: 0,
			states: {
				active: false
			}
		}
		ms.data.veil = {
			element: $('<div class="l-content-veil"></div>').appendTo('body'),
			states: {
				active: false
			},
			toggle: function() {
				if (this.states.active) {
					this.element.fadeOut(300);
					this.states.active = false;
					ms.data.view.hide(); // Hide content
				}
				else {
					this.element.fadeIn(300);
					this.states.active = true;
				}
			},
			show: function(){
				this.element.fadeIn(300);
				this.states.active = true;
			},
			hide: function(){
				this.element.fadeOut(300);
				this.states.active = false;
				ms.data.view.hide(); // Hide content
			}
		}

		//Callback
		ms.callback(o);
	}
	ms.setupSound = function() {
		ms.data.sound.player.element = $('#ambientSound');
		ms.data.sound.player.states = {
			playing: false
		}
		ms.data.sound.player.element.jPlayer({
			ready: function(event) {
				$(this).jPlayer("setMedia", {
	                mp3: "/sound/ms.mp3",
	                oga: "/sound/ms.ogg"
	            }).jPlayer("play");
	            ms.data.sound.player.states.playing = true;
	            if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
					ms.stopSound();
				}
			},
			ended: function() {
				$(this).jPlayer("play");
			},
			swfPath: "http://jplayer.org/latest/js",
        	supplied: "mp3, oga"
		});
		ms.data.sound.control.element = $('.l-header-sound');
		ms.data.sound.control.element.on('click.sound',function(event){
			event.preventDefault();
			//ms.log(ms.data.sound.player.states.playing);
			if (ms.data.sound.player.states.playing) {
				ms.pauseSound();
			}
			else {
				ms.startSound();
			}
		});
	}
	ms.startSound = function() {
		ms.data.sound.player.element.jPlayer("play");
		ms.data.sound.control.element.removeClass('mute');
		ms.data.sound.player.states.playing = true;
	}
	ms.pauseSound = function() {
		ms.data.sound.player.element.jPlayer("pause");
		ms.data.sound.control.element.addClass('mute');
		ms.data.sound.player.states.playing = false;
	}
	ms.stopSound = function() {
		ms.data.sound.player.element.jPlayer("stop");
		ms.data.sound.control.element.addClass('mute');
		ms.data.sound.player.states.playing = false;
	}
	// Detect Useragent
	ms.detectUseragent = function() {

	}
	// Generate unique code
	ms.generateCode = function() {
		var code = Math.random().toString(36).substr(2,16);
		return code;
	}
	// Update Scroll content
	ms.updateScrollContent = function(options) {
		var o = ms.extend(options);
		$(".l-content-scroll").mCustomScrollbar({
			theme: "dark-thick"
		});
		//$(".l-content-scroll").mCustomScrollbar('update');
		//add nav scroll link listener
		ms.data.view.content.element.find('.l-content-nav a').on('click.nav',function(event){
			event.preventDefault();
			var link = $(this).attr('href');
			link = link.replace("#","");
			var positionTop = ms.data.view.content.element.find('#'+link).position().top;
			if (positionTop != undefined && positionTop != null) {
				$(".l-content-scroll").mCustomScrollbar("scrollTo",positionTop);
			} 
		});
		//Callback
		ms.callback(o);
	}
	// deactivate all hotspots
	ms.closeHotspots = function(options) {
		var o = ms.extend(options);
		$(ms.data.hotspots).each(function(){
			if (this.states.active) this.deactivate();
		});
		//Callback
		ms.callback(o);
	}
	ms.centerHotspotContent = function(options) {
		var o = ms.extend(options);
		$(ms.data.hotspots).each(function(){
			var height = this.element.find('.l-panorama-hotspotInnerContent').height();
			var containerHeight = this.element.find('.l-panorama-hotspotContent').height();
			var diff = containerHeight - height;
			this.element.find('.l-panorama-hotspotInnerContent').css('margin-top',diff / 2);
		});
		//Callback
		ms.callback(o);
	}
	// Setup Controls
	ms.setupControls = function(options) {
		var o = ms.extend(options);
		
		//Setup controls for pages
		$(ms.data.pages).each(function(){
			this.element.on('click.page',function(event){
				event.preventDefault();
				var page = $.data(this,'page');
				page.activate();
				//deactivate all other pages
				$(ms.data.pages).each(function(){
					if (this != page) this.deactivate();
				});
			});
		});

		// Setup controls for hotsport
		$(ms.data.hotspots).each(function(index){
			this.element.on('click.hotspot',function(event){
				event.preventDefault();
				var hotspot = $.data(this,'hotspot');
				hotspot.activate();
				$(ms.data.hotspots).each(function(){
					if (this != hotspot) this.deactivate();
				});
			});
		});

		// Setup controls for veil click
		$(ms.data.veil.element).on('click.veil',function(event){
			event.preventDefault();
			var veil = $.data(this,'veil');
			veil.hide();
		});

		// Setup click on content close button
		$('.l-content-close').on('click.close',function(event){
			event.preventDefault();
			ms.data.view.hide();
		});

		//Callback
		ms.callback(o);
	}
	// callback
	ms.callback = function(options) {
		var o = ms.extend(options);
		if (o.complete && typeof(o.complete) === 'function') {  
	      	o.complete();
	 	}  
	}
	// extend
	ms.extend = function(options) {
		var o = jQuery.extend({}, ms.paramap, options || {});
		return o;
	}
	// Console log
	ms.log = function(msg) {
		try {
			console.log(msg);
		}
		catch(err) {
			//send error to developer platform
		}
	}
 /**---------------------------------------
	DOM Ready
---------------------------------------**/   
	$(function(){

		ms.init({complete:function(){

			ms.detectUseragent();

			$.data(ms.data.veil.element[0],'veil',ms.data.veil); // Associate Veil with its object
		
			$.ajax({
				url : 'data.json',
				dataType : 'json',
				success : function(data) {
					//ms.log(data);

					if (data.startPos != undefined) ms.data.panorama.startPos = data.startPos;
					if (data.showControls != undefined)	ms.data.panorama.showControls = data.showControls;
					
					// Pages
					$(data.pages).each(function(){
						var pag = this;

						// New page
						var page = {};
						page.id = pag.id;
						page.title = pag.title;
						page.template = pag.template;
						page.hidden = pag.hidden;
						page.link = pag.link;
						page.target = pag.target;
						page.states = {};
						page.states.active = false;

						// Check charater length and use appropriate class
						var pageTitleLength = pag.title.length;
						var className = "";
						if (pageTitleLength < 6) className = "paper-tiny";
						else if (pageTitleLength >= 6 && pageTitleLength < 9) className = "paper-small";
						else if (pageTitleLength >= 9 && pageTitleLength < 15) className = "paper-medium";
						else if (pageTitleLength >= 15 && pageTitleLength < 18) className = "paper-large";
						else if (pageTitleLength > 18) className = "paper-huge";
						
						page.element = $('<li class="paper '+className+'"><a class="paper-text" href="#'+pag.id+'">'+pag.title+'</a></li>');
						// if page is not hidden then append to nav
						if (page.hidden != true && page.hidden != "true") {
							page.element.appendTo('.l-header-nav ul');
						}
						
						// Methods
						page.activate = function() {
							var scope = this;

							if (scope.states.active) return false;

							if (scope.link != null || scope.link != undefined) {
								if (scope.target == '_self') {
									window.open(scope.link,'_self');
								}
								else {
									window.open(scope.link,'_blank');
								}
								return false;
							} 
							//Load template data
							$.ajax({
								url : scope.template,
								dataType : 'html',
								success : function(data) {
									ms.data.view.element.trigger("page.beforeActivate",scope);
									ms.data.veil.show(); // Show veil
									ms.data.view.content.element.html(data) // Put content
									ms.data.view.show(); // Show content

									//Setup cross page linking
									ms.data.view.content.element.find('a[href^="$page"]').each(function(){
										$(this).on('click.page',function(event){
											event.preventDefault();
											var link = $(this).attr('href');
											var id = link.split("#");
											id = id[1];
											if (id != undefined && id != null && id.length != 0) {
												var found = false;
												$(ms.data.pages).each(function(){
													if (this.id == id && this.states.active == false) {
														found = true;
														this.activate();
													}
												});
												if (!found) {
													$(ms.data.lightboxes).each(function(){
														if (this.id == id) {
															found = true;
															this.activate();
														}
													});
												}
											}
										});
									});

									ms.updateScrollContent(); // Update custom scrollbar

									//activate associated hotspots
									$(ms.data.hotspots).each(function(){
										var link = this.link.replace('#','');
										if (link == scope.id) this.activate();
									});
									ms.data.view.element.trigger("page.activate",scope);
									scope.states.active = true;
									scope.element.addClass('active');
								},
								error : function() {
									ms.log('error loading template');
								}
							});
						}
						page.deactivate = function() {
							var scope = this;

							ms.data.veil.hide(); // Hide veil
							ms.data.view.hide(); // Hide content

							scope.states.active = false;
							scope.element.removeClass('active');
						}
		
						$.data(page.element[0],'page',page); //Store page object in association with dom element
						ms.data.pages.push(page); //Add page object to app pages data
					});
					
					// Hotspots
					$(data.hotspots).each(function(){
						var hot = this;

						var cords = hot.xPos+','+hot.yPos+','+(hot.xPos+hot.width)+','+(hot.yPos+hot.height);
			
						var id = ms.generateCode();

						// New hotspot
						var hotspot = {};
						hotspot.id = id;
						//hotspot.title = hot.title;
						hotspot.title = hot.title;
						hotspot.comment = hot.comment; if (hotspot.comment == undefined) hotspot.comment = '';
						hotspot.line1 = hot.line1; if (hotspot.line1 == undefined) hotspot.line1 = '';
						hotspot.line2 = hot.line2; if (hotspot.line2 == undefined) hotspot.line2 = '';
						hotspot.link = hot.link;
						hotspot.target = hot.target;
						hotspot.element = $('<area shape="rect" class="hotspot l-panorama-hotspot '+id+'" coords="'+cords+'" />').appendTo('#hotspots');
						hotspot.debug = hot.debug;
						hotspot.states = {};
						hotspot.states.active = false;

						// Methods
						hotspot.activate = function() {
							var scope = this;
							if (scope.states.active) return false; // if active then don't do anything
							ms.data.view.element.trigger("hotspot.beforeActivate",scope);
							// Page link
							if (scope.link.indexOf('#') != -1) {
								//activate associated pages
								var link = scope.link.replace('#','');
								$(ms.data.pages).each(function(){
									if (this.id == link) this.activate();
								});
								$(ms.data.lightboxes).each(function(){
									if (this.id == link) this.activate();
								});
								ms.data.view.element.trigger("hotspot.activate",scope);
								scope.states.active = true;
								scope.element.addClass('active');
							}
							// Http link
							if (scope.link.indexOf('http') != -1 || scope.link.indexOf('www') != -1) {
								if (scope.target == '_self') {
									window.open(scope.link,'_self');
								}
								else {
									window.open(scope.link,'_blank');
								}
							}
						}
						hotspot.deactivate = function() {
							var scope = this;

							scope.states.active = false;
							scope.element.removeClass('active');
						}
						$.data(hotspot.element[0],'hotspot',hotspot); // Store hotspot object in association with dom element
						ms.data.hotspots.push(hotspot); // Add hotspot object to app hotspot data
					});

					// Lightboxes
					$(data.lightboxes).each(function(){
						var light = this;
						// New gallery
						var lightbox = {};
						lightbox.id = light.id;
						lightbox.title = light.title; 
						lightbox.template = light.template;
						lightbox.states = {};
						lightbox.states.active = false;
						lightbox.states.sleep = true;
						lightbox.element = $('<div class="l-panorama-lightbox" id="'+lightbox.id+'"></div>').appendTo('body');

						$.ajax({
							url : lightbox.template,
							dataType : 'html',
							success : function(data) {
								lightbox.element.html(data);
								lightbox.states.sleep = false;
								//Add rel to gallery items
								lightbox.element.find('a[href]').attr('rel',lightbox.id);
								//ms.log(lightbox.element.find('a[href]').first());

								//lightbox.element.find('a[href]').first().fancybox({
								lightbox.element.find('a[href][rel="'+lightbox.id+'"]').fancybox({
									prevEffect	: 'none',
									nextEffect	: 'none',
									beforeClose : function() {
										// deactivate
										var lightboxObj = $(lightbox.element).data('lightbox');
										lightboxObj.deactivate();
									},
									helpers	: {
										title	: {
											type: 'inside'
										},
										thumbs	: {
											width	: 50,
											height	: 50
										},
									}
								});	

							},
							error : function() {
								ms.log('error loading template');
							}
						});
						
						// Methods
						lightbox.activate = function() {
							var scope = this;
							if (scope.states.active || scope.states.sleep) return false; // if active or sleep then don't do anything
							
							ms.data.view.element.trigger("lightbox.beforeActivate",scope);

							scope.element.find('a[href]').first().click();

							//listen for error and close to change state

							ms.data.view.element.trigger("lightbox.activate",scope);
							scope.states.active = true;
						}
						lightbox.deactivate = function() {
							var scope = this;

							ms.closeHotspots();

							scope.states.active = false;
						}
						$.data(lightbox.element[0],'lightbox',lightbox); // Store lightbox object in association with dom element
						ms.data.lightboxes.push(lightbox); // Add lightbox object to app lightboxes data
					});

					// Initialize plugin
					ms.data.panorama.element.panorama360({
						start_position: ms.data.panorama.startPos,
						sliding_controls: ms.data.panorama.showControls
					}); 

					// Update hotspot element data
					$(ms.data.hotspots).each(function(index){
						var hotspot = this;
						hotspot.element = $('.'+hotspot.id);

						var html = '';
						html += '<div class="l-panorama-hotspotContent">';
							html += '<div class="l-panorama-hotspotLeft">';
							html += '</div>';
							html += '<div class="l-panorama-hotspotInnerContent">';
								html += '<div class="l-panorama-hotspotComment">'+hotspot.comment+'</div>';
								html += '<div class="l-panorama-hotspotLine1">'+hotspot.line1+'</div>';
								html += '<div class="l-panorama-hotspotLine2">'+hotspot.line2+'</div>';
							html += '</div>';
							html += '<div class="l-panorama-hotspotRight">';
							html += '</div>';
						html += '</div>';

						if (hotspot.debug) {
							hotspot.element.addClass('l-panorama-debug');
						}

						hotspot.element.append(html);
						//$.data(hotspot.element[0],'hotspot',hotspot); // Store hotspot object in association with dom element
						$(hotspot.element).data('hotspot',hotspot); // Store hotspot object in association with dom element
					});
					// Center content in hotspot
					ms.centerHotspotContent();
					// Setup Controls
					ms.setupControls();
				},
				error : function() {
					ms.log('bugged json!!');
					//callback.callback(o);
				}
			});

			ms.setupSound();

		}});

	});
/**---------------------------------------
	Page loaded
---------------------------------------**/  
	$(window).load(function(){
		
		//Init custom scrollbar
		$(".l-content-scroll").mCustomScrollbar({
			theme: "dark-thick"
		});

		ms.data.view.element.on('page.activate',function(event,obj){
			ms.log('page.activate');
			ms.log(obj);
		});


		var _gaq = _gaq || [];
        (function() {
          var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
          ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + 
              '.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

		try {
            _gaq.push(['_setAccount', 'YOUR_ANALYTICS_ID_GOES_HERE']);
			/*
            if ($.mobile.activePage.attr("data-url")) {
                _gaq.push(['_trackPageview', $.mobile.activePage.attr("data-url")]);
            } else {
                _gaq.push(['_trackPageview']);
            }
            */
        } catch(err) {}

	});
})(this,document);


