$( function() {
	var owl = $('#carousel-main');

	owl.owlCarousel({
		singleItem: true,
		autoPlay: true,
		slideSpeed: 1000,
		pagination: false
	});

	$('.next').click(function(){
		owl.trigger('owl.next');
	});

	$('.prev').click(function(){
		owl.trigger('owl.prev');
	});


	//----------------------------------
	// carousel featured
	var owlFeat = $('#carousel-featured');

	owlFeat.owlCarousel({
		singleItem: true,
		autoPlay: true
	});
} );