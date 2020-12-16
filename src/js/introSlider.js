import gsap from 'gsap';

export default function IntroSlider() {
    const elements = Array.from(document.querySelectorAll('.js-intro-slider'));

    elements.forEach(element => {
        const cards = Array.from(element.querySelectorAll('.intro__slider-card'));
        const paginationContainer = element.querySelector('.intro__slider-pagination');
        let paginationBullets = [];
        let activeIndex = 0;

        const createPagination = () => {
            paginationBullets = cards.map(() => {
                const bullet = document.createElement('div');

                bullet.className = 'intro__slider-pagination-bullet';

                bullet.innerHTML = `
                    <span class="intro__slider-pagination-bullet-dot">
                        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <circle cy="100" cx="100" r="80" fill="transparent" stroke="white" stroke-opacity="1" stroke-width="12" stroke-linecap="round">
                            </circle>
                            <circle cy="100" cx="100" r="80" fill="transparent" stroke="white" stroke-width="10" stroke-dasharray="500" stroke-linecap="round">
                            </circle>
                        </svg>
                    </span>
                `;

                return bullet;
            });
            paginationContainer.append(...paginationBullets);
        };

        const setActiveSlide = index => {
            cards.forEach(card => card.classList.remove('active'));
            cards[index].classList.add('active');
            paginationBullets.forEach(bullet => bullet.classList.remove('active'));

            paginationBullets[index].classList.add('active');

            activeIndex = index;
        };

        createPagination();

        setActiveSlide(activeIndex);

        const autoplay = startIndex => {
            console.log('Starting autoplay for bullet', paginationBullets[startIndex]);
            gsap.fromTo(
                paginationBullets[startIndex],
                { '--slider-progress': 0 },
                {
                    '--slider-progress': 1,
                    duration: 10,
                    ease: 'linear',
                    onComplete: () => {
                        if (cards[startIndex + 1]) {
                            setActiveSlide(startIndex + 1);
                            autoplay(startIndex + 1);
                        } else {
                            setActiveSlide(0);
                            autoplay(0);
                        }
                    }
                }
            );
        };

        if (cards.length >= 2) {
            autoplay(activeIndex);
        }

        paginationBullets.forEach((bullet, bulletIndex) => {
            bullet.addEventListener('click', event => {
                event.preventDefault();

                setActiveSlide(bulletIndex);

                paginationBullets.forEach(bullet => {
                    gsap.set(bullet, {
                        '--slider-progress': 0
                    });
                    gsap.killTweensOf(bullet);
                });
                autoplay(bulletIndex);
            });
        });
    });
}
