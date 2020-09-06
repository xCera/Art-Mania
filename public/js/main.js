const burger = $('.burger');

burger.on('click', () => {
	burger.toggleClass('burgerAnim');
	$('.nav-links').toggleClass('nav-active');
});
