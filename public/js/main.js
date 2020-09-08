const burger = $('.burger');

burger.on('click', () => {
	burger.toggleClass('burgerAnim');
	$('.nav-links').toggleClass('nav-active');
});

$('.comment-form').css('display', 'none');
$('.edit-comment-form').css('display', 'none');

$('.show-form').on('click', () => {
	$('.comment-form').slideToggle();
});

$('.show-comment-form').on('click', () => {
	let id = $('#pomocna').text();
	$(`#${id}`).slideToggle();
});

$(window).scroll(() => {
	let scroll = $(window).scrollTop();
	if (scroll > 50) {
		$('nav').addClass('scrolled');
	} else {
		$('nav').removeClass('scrolled');
	}
});
