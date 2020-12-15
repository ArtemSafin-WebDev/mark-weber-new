
import gsap from 'gsap';
import Hammer from 'hammerjs';


export default function MainSlider() {
    const elements = Array.from(document.querySelectorAll('.js-main-slider'));

    elements.forEach(element => {
        const cardsContainer = element.querySelector('.main-slider__cards');
        let activeIndex = 0;
        const cards = Array.from(element.querySelectorAll('.main-slider__card'));
        const threshold = 250;
        if (!cards.length || cards.length < 2) {
            console.warn('Not enough cards');
            return;
        }
        let transitioning = false;

        let cardInitialWidth = cards[0].offsetWidth;
        let cardScaleMultiplier = 1.4;

        const cardsData = cards.map(card => {
            return {
                card,
                x: 0
            };
        });

        const setActiveCard = index => {
            console.log('Setting active index', index)
            cards.forEach((card, cardIndex) => {
                if (cardIndex !== index) {
                    card.classList.remove('active');
                    gsap.to(card, {
                        duration: 0.4,
                        width: cardInitialWidth,
                        
                    });
                } else {
                    card.classList.add('active');
                    gsap.to(card, {
                        duration: 0.4,
                        width: cardInitialWidth * cardScaleMultiplier,
                        onComplete: () => {
                            transitioning = false;
                        }
                    });
                }


                
            });
            activeIndex = index;
        };


        setActiveCard(0)

        console.log('Cards data', cardsData);

        const hammertime = new Hammer(cardsContainer);

        let filterLinksClicks = false;
        hammertime.on('panstart', function(event) {
            filterLinksClicks = true;
        });
        hammertime.on('panmove', function(event) {
            if (transitioning) return;
            console.log('Panmove');
            cards.forEach(card => {
                const cardData = cardsData.find(cardDataItem => cardDataItem.card === card);
                const position = cardData.x + event.deltaX;

                gsap.set(card, {
                    x: position
                });

                if (position + card.offsetLeft < -30) {
                    gsap.set(card, {
                        x: -30 - card.offsetLeft
                    });
                    gsap.to(card, {
                        autoAlpha: 0,
                        duration: 0.3,
                        scale: 0
                    })
                } else {
                    gsap.to(card, {
                        autoAlpha: 1,
                        duration: 0.3,
                        scale: 1
                    })
                }

                
                if (Math.abs(event.deltaX) > threshold) {
                    transitioning = true;
                }
                
            });
        });

        hammertime.on('panend', function(event) {
            cards.forEach(card => {
                const cardData = cardsData.find(cardDataItem => cardDataItem.card === card);
                const position = cardData.x + event.deltaX;

                cardData.x = position;
            });


            if (Math.abs(event.deltaX) > threshold) {
                setActiveCard(activeIndex + 1);
            } else {
                console.log('Not changing slide', {
                    delta: Math.abs(event.deltaX),
                    threshold
                })

                transitioning = false;
            }


            

            setTimeout(() => {
                filterLinksClicks = false;
            }, 200);
        });

        cardsContainer.addEventListener('click', event => {
            if (event.target.matches('a') || event.target.closest('a')) {
                if (filterLinksClicks) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        });
    });
}
