const homeChooseSlider = () => { 
	document.addEventListener("DOMContentLoaded", function() {
		let homeChooseSlider = document.querySelector('.home-choose-slider'); 
		if (homeChooseSlider) {      
		const homeChooseSliderInstance = new Swiper('.home-choose-slider', {
			// Optional parameters
			direction: 'horizontal',
			loop: true, // Enable infinite loop
			allowThresholdMove: true,
			slidesPerView: 1, // Default to 1 slide per view
			spaceBetween: 7,
			autoplay: {
			delay: 3000, // Change slide every 3 seconds
			disableOnInteraction: false, // Continue autoplay after interaction
			},
			// Navigation arrows
			navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			},
			breakpoints: {
			// when window width is >= 640px

			480: {
				slidesPerView: 2,
				spaceBetween: 10,
			},
			800: {
				slidesPerView: 3,
				spaceBetween: 10,
			},
			}
		});
		}
	});
}

export default homeChooseSlider;
