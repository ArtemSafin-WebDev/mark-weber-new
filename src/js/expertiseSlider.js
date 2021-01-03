import { Swiper, Autoplay, Navigation, Parallax, Controller } from 'swiper';

Swiper.use([Autoplay, Navigation, Parallax, Controller]);

import gsap from 'gsap';

export default function ExpertiseSlider() {
    const elements = Array.from(document.querySelectorAll('.js-expertise'));

    elements.forEach(element => {
        const navLinks = Array.from(element.querySelectorAll('.expertise__navigation-link'));
        const navSliderContainer = element.querySelector('.expertise__nav-slider .swiper-container');
        const mainSliderContainer = element.querySelector('.expertise__main-slider .swiper-container');

        const navSlider = new Swiper(navSliderContainer, {
            slidesPerView: 1,
            speed: 800,
            watchOverflow: true,
            spaceBetween: 45,
            allowTouchMove: true,
            slideToClickedSlide: true,
            init: false
        });

        const mainSlider = new Swiper(mainSliderContainer, {
            slidesPerView: 1,
            speed: 800,
            watchOverflow: true,
            spaceBetween: 45,
            allowTouchMove: false,
            parallax: true
        });

        function highlightActiveNavSlide(swiper) {
            const slides = swiper.slides;
            const currentSlide = swiper.slides[swiper.realIndex];

            slides.forEach(slide => {
                const card = slide.querySelector('.expertise__nav-slider-card');
                if (slide === currentSlide) {
                    gsap.to(card, {
                        duration: 0.8,
                        ease: 'easeOut',
                        webkitTextFillColor: 'rgba(36, 40, 43, 1)',
                        webkitTextStrokeColor: '#24282b'
                    });
                } else {
                    gsap.to(card, {
                        duration: 0.8,
                        ease: 'easeOut',
                        webkitTextFillColor: 'rgba(36, 40, 43, 0)',
                        webkitTextStrokeColor: '#9BA1A4'
                    });
                }
            });

            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[swiper.realIndex].classList.add('active');

            console.log('Current slide', currentSlide);
        }

        navSlider.on('init', highlightActiveNavSlide);
        navSlider.on('slideChange', highlightActiveNavSlide);

        navSlider.init();

        navSlider.controller.control = mainSlider;
        mainSlider.controller.control = navSlider;

       

        navLinks.forEach((link, linkIndex) => {
            link.addEventListener('click', event => {
                event.preventDefault();
                navSlider.slideTo(linkIndex);
            });
        });
    });
}
