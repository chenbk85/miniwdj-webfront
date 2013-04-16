(function(){
	$.fn.extend(
		{
			/****************** tabs ***********************/
			miniTabs:function(options){
				var defaults = {
					speed : 300
				}
				var options = $.extend(defaults, options);
				return this.each(function(){
					$(this).bind('click', function(){
						if(!$(this).hasClass('active')){
							$(this).addClass('active');
							$(this).siblings().removeClass('active');
							var ind = $(this).index();
							$('.content-box').not('hide').hide().addClass('hide');
							$('.content-box').eq(ind).fadeIn(options.speed).removeClass('hide');					
						}
					})
				});
			},
			/********************** slides ***********************/
			miniSlides:function(options){
				var defaults = {
					speed : 400,
					count : 20,
					child : 'ul.original li',
					container : '.slides_container',
					finger: 0
				}
				var options = $.extend(defaults, options);
				return this.each(function(){
					var self = $(this);
					//divide the list into frames
					
					//first we make the container to become to the original status
					var slides = self.find('ul.silde-frame');
					if(slides.length > 0){
						slides.each(function(){
							self.find('ul.original').get(0).innerHTML += $(this).html();
							$(this).remove();
						});
					}
					
					self.find('.frame-a , .frame-b, .frames-indicators-wrapper, .slide-next, .slide-pre').remove();
					if(self.find('.slides-wrapper').parent().is('.slide-arrow-wrapper')){
						self.find('.slides-wrapper').unwrap('.slide-arrow-wrapper');
					}
					
					function creatFrames(){
						var ln = parseInt(self.find(options.child).length,10);
						
						if(ln>0){
							var fm = $('<ul class="silde-frame clear-fix"></ul>');
							var last = 0;	
										
							if(ln>=options.count){
								last = options.count;
							}else{
								last = ln;
							}	
							for(var i=0; i < last; i++){
							  self.find(options.child).eq(0).appendTo(fm);
							}						
							fm.appendTo(self.find(options.container)).hide();	
							//recursion
							arguments.callee();
						}		
					}
					creatFrames();
					//defaults.finger = self.find('ul.silde-frame').length -1;

					//make frames to slides
					$(options.container).css({
						'position' : 'relative',
						'height'   : '340px'
					})
					self.find(options.container).prepend('<ul class="frame-a"></ul><ul class="frame-b"></ul>')
												.css({
													'width': '200%'
												});			
					var fl = self.find('.silde-frame').length;			
					//if we have more than one frames, we create the indicators at the bottom of the frames.
					if(fl > 1){
						//add preview and next button
						self.find('.slides-wrapper').wrap('<div class="slide-arrow-wrapper"/>');
						self.find('.slide-arrow-wrapper').append('<a class="slide-pre" href="#x">preview</a><a class="slide-next" href="#x">next</a>');
						//console.log(options.finger);
						if(options.finger > self.find('.silde-frame').length-1 ){
							options.finger = self.find('.silde-frame').length-1;
							self.find('.slide-next').hide();
						}
						if(options.finger == self.find('.silde-frame').length-1){	
							self.find('.slide-next').hide();
						}
						if(options.finger == 0){
							self.find('.slide-pre').hide();
						}
						//add indicators
						self.find('.slides-wrapper').append('<div class="frames-indicators-wrapper"></div>');
						self.find('.silde-frame').each(function(){
							self.find('.frames-indicators-wrapper').append('<a class="indicator" href="#x"></a>');
							
						});
						//console.log(options.finger);
						self.find('.indicator').eq(options.finger).addClass('active');
						self.find('.frame-a').html(self.find('.silde-frame').eq(options.finger).html());
					}else{
						self.find('.frame-a').html(self.find('.silde-frame').eq(0).html());
					}
					
					
					//the public function of sliding
					function frameSliding(index,current){
						var fb = self.find('.frame-b');
						fb.html(self.find('.silde-frame').eq(index).html());
						var ct = self.find(options.container);
						var flag = true;
						function reset(){
							flag = true;
							this.find('.frame-a').html(self.find('.frame-b').html());
							this.css({
								'left':'0'
							});
							self.find('.indicator.active').removeClass('active');
							self.find('.indicator').eq(index).addClass('active');
							if(self.find('.indicator.active').index() == self.find('.indicator').length -1){
								self.find('.slide-next').hide();
							}else{
								self.find('.slide-next').show();
							}
							if(self.find('.indicator.active').index() != 0){
								self.find('.slide-pre').show();
							}else{
								self.find('.slide-pre').hide();
							}
						}
						var wd = self.find('.slides-wrapper').width();
						function containnerAnimation(framebLeft, containnerMarginLeft){
							flag = false;
							fb.css({
								'left' : framebLeft
							});
							ct.animate(
								{'left' : containnerMarginLeft},
								400,
								function(){
									reset.call($(this));
								}
							);
						}
						if(index > current && flag == true){
							containnerAnimation(wd+'px','-100%');	
						}
						if(index < current && flag == true){
							containnerAnimation(-wd + 'px','100%');	
						}					
					}
					//indicator clicking					
					self.find('.indicator').bind('click', function(){
						var idx = $(this).index();
						var crt = self.find('.indicator.active').index();
						frameSliding(idx,crt);
					});	
					//next clicking				
					self.find('.slide-next').bind('click', function(){
						var crt = self.find('.indicator.active').index();
						var idx = crt + 1;
						frameSliding(idx,crt);
					});
					//preview clicking					
					self.find('.slide-pre').bind('click', function(){
						var crt = self.find('.indicator.active').index();
						var idx = crt - 1;
						frameSliding(idx,crt);
					});
				});
				
			},
			/**************** mini scroll bar ******************/
			miniScrollBar:function(options){
				var defaults = {
					scrollInner   : '.scroll-inner',
					scrollContent : '.scroll-content'
				}
				var options = $.extend(defaults, options);
				return this.each(function(){
					var self = $(this);
					var wrapperHeight = self.find(options.scrollInner).height();
					var contentHeight = self.find(options.scrollContent).height();
					var ratio = wrapperHeight/contentHeight;
					var scroller,bar;

					//$(document).unbind('mousemove', winMove);
					//$(document).unbind('mouseup', winUp);
					self.find('.scroller').remove();
					self.find('.scroll-bar').unbind();
					if(ratio < 1){
						self.find(options.scrollInner).prepend('<div class="scroller"><div class="scroll-bar"></div></div>');
						scroller = self.find('.scroller');
						bar = self.find('.scroll-bar');
						setScroll();

						handleScroll();
					}
					function setScroll(){
						scroller.css({
							height : wrapperHeight + 'px'
						});
						
						bar.css({
							height: parseInt(wrapperHeight * ratio) + 'px'
						})
						
					}
					function handleScroll(){
						var originalBarTop, originalClientY,currentClientY;
						var flag = false;
						bar.bind('mousedown',function(event){					
							flag = true;
							originalBarTop = parseInt($(this).css('top'),10);
							originalClientY = event.clientY;
						});
						
						function winMove(){
							if(flag){		
								currentClientY = event.clientY;
								var currentBarTop = currentClientY - originalClientY + originalBarTop;
								
								if(currentBarTop + bar.height() <= wrapperHeight && currentBarTop >= 0){
									bar.css({
										'top' : currentBarTop + 'px'
									});
									self.find(options.scrollContent).css({
										top : -(currentBarTop/ratio) + 'px'
									});
								}
							}	
						}
						
						function winUp(){
							flag = false;
						}
							
						$(document).bind('mousemove', function(event){
							winMove();
						})
					
					
						$(document).bind('mouseup', function(){
							winUp();
						})
							
						
					}
				});
			}
		}
	);
})(jQuery);
	
$(document).ready(function(){
	//tabs
	$('.nav li').miniTabs();
	//slides
	//$('.slides.downloaded').miniSlides();
	/*$('.slides.need-update').miniSlides({
		count : 12
	});*/
	//when remove an item form slide, it will recall the miniSlide function again
	
	//scrollbar
	$('#scrollbar1').miniScrollBar();
	
	//test inserting app to download list
	function testDownload(){
		var ct = '<li class="app"><a class="show-unstall" href="#" hideFocus="true"><span class="unstall"></span><img src="http://img.wdjimg.com/mms/icon/v1/a/24/6ee458dd65cef5b22132145a8c1c224a_68_68.png" class="icon" width="68" /><span class="name">1-----百度地图</span></a></li>';
		$('.downloaded .original').append(ct);
		$('.slides.downloaded').miniSlides({
			count : 20
		});
	}
	$('.testDownload').bind('click', function(){
		testDownload();
	})
	
	//test removing app from download list
	$('.testRemove').bind('click', function(){
		appRemove($('.downloaded .frame-a .unstall').eq(0));
	})
	
	//test inserting app to update list
	function testUpdate(){
		var ct = '<li class="app"><a class="show-unstall" href="#" hideFocus="true"><img src="http://img.wdjimg.com/mms/icon/v1/9/a9/e82f85c405cf1ce07ac7569312865a99_68_68.png"  class="icon" width="68" /><span class="name">4---手机QQ</span>	<a href="#" class="update" onClick="blur()" hideFocus="true">升级</a>	</a></li>';
		$('.need-update .original').append(ct);
		$('.slides.need-update').miniSlides({
			count : 12
		});
	}
	$('.testUpdate').bind('click', function(){
		testUpdate();
	})
	
	//test removing app from update list
	$('.testUpdateRemove').bind('click', function(){
		appRemove($('.need-update .frame-a .update').eq(0));
	})
});
