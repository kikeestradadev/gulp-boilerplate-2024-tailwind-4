const homeTrustedSlider = () => { 
	document.addEventListener("DOMContentLoaded", function() {
		let homeTrustedSlider = document.querySelector('.home-trusted-slider'); 
		if (homeTrustedSlider) {      
		const homeTrustedSliderInstance = new Swiper('.home-trusted-slider', {
			// Optional parameters
			direction: 'horizontal',
			loop: true, // Enable infinite loop
			allowThresholdMove: true,
			autoHeight: true,
			watchOverflow: true,
			autoplay: {
			delay: 3000, // Change slide every 3 seconds
			disableOnInteraction: false, // Continue autoplay after interaction
			},
			// Navigation arrows
			navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			}
		});
		}
	});
}

export default homeTrustedSlider;
