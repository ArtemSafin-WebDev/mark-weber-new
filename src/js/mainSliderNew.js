import gsap from 'gsap';
import Hammer from 'hammerjs';
import { debounce } from 'lodash';

export default class MainSliderNew {
    constructor(element) {
        console.log('Initializing on element', element);
        this.rootElement = element;
        this.cards = Array.from(element.querySelectorAll('.main-slider__card'));
        if (!this.cards.length) {
            console.warn('No slider cards');
            return;
        }
        this.cardsContainer = element.querySelector('.main-slider__cards');
        this.locked = false;
        this.filterClicks = false;
        this.filterClicksDelay = 200;
        this.activeIndex = 0;
        this.marginRight = this.calculateMargin();
        this.maximumOffset = 400;
        this.scaleMultiplier = 1.4;
        this.initialCardWidth = this.calculateInitialCardWidth();
        this.threshold = this.initialCardWidth * 0.9;
        this.leftBorder = this.calculateLeftBorder();
        this.touchContainer = new Hammer(this.cardsContainer);
        this.cardPositions = this.calculateCardPositions();

        this.initialSetup();
        this.bindListeners();
    }

    calculateInitialCardWidth = () => {
        const initialCardWidth = this.cards[0].offsetWidth;
        console.log('Initial card width', initialCardWidth);
        return initialCardWidth;
    };

    calculateMargin = () => {
        const styles = getComputedStyle(this.cards[0]);
        const margin = parseInt(styles.marginRight, 10);
        console.log('Calculated margin', margin);
        return margin;
    };

    calculateLeftBorder = () => {
        const leftBorder = this.cardsContainer.getBoundingClientRect().left;
        console.log('Calculating left border', leftBorder);
        return leftBorder;
    };

    initialSetup = () => {
        const initialActiveCard = this.cards[this.activeIndex];
        this.cards.forEach(card => {
            gsap.set(card, {
                width: this.initialCardWidth
            });
            card.classList.remove('active');
        });

        initialActiveCard.classList.add('active');

        gsap.set(initialActiveCard, {
            width: this.initialCardWidth * this.scaleMultiplier
        });

        this.cardPositions = this.calculateCardPositions();
    };

    calculateCardPositions = () => {
        const positions = this.cards.map((card, cardIndex) => {
            return {
                card,
                cardIndex,
                xTransform: 0
            };
        });

        console.log('Calculated card positions', positions);

        return positions;
    };

    unlockSlider = () => {
        setTimeout(() => {
            this.locked = false;
        }, 300)
    }

    handlePanStart = event => {
        console.log('Panstart');

        this.filterClicks = true;
    };

    handlePanMove = event => {
        if (this.locked) {
            console.log('Panmove blocked');
            return;
        }

        console.log('Panmove');

        this.cardPositions.forEach(cardPosition => {
            if (cardPosition.cardIndex <= this.activeIndex && event.offsetDirection === 2) {
                gsap.set(cardPosition.card, {
                    x: cardPosition.xTransform
                });
            } else {
                gsap.set(cardPosition.card, {
                    x: cardPosition.xTransform + event.deltaX
                });
            }
        });

        if (Math.abs(event.deltaX) >= this.threshold) {
            this.locked = true;
            return;
        }
    };
    

    handlePanEnd = event => {
        console.log('Panend');

        if (Math.abs(event.deltaX) >= this.threshold) {
            const direction = event.offsetDirection === 1 ? 'right' : 'left';
            const currentCard = this.cards[this.activeIndex];
            console.log(`Slidechange happened in direction: ${direction}`);

            this.locked = true;

            if (direction === 'left' && this.cards[this.activeIndex + 1]) {
                gsap.to(currentCard, {
                    autoAlpha: 0,
                    duration: 0.3
                });

                this.cardPositions.forEach(cardPosition => {
                    if (cardPosition.cardIndex <= this.activeIndex) {
                        return;
                    } else if (cardPosition.cardIndex === this.activeIndex + 1) {
                        const newTransform = cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier - this.marginRight;
                        gsap.to(cardPosition.card, {
                            duration: 0.3,
                            x: newTransform,
                            width: this.initialCardWidth * this.scaleMultiplier,
                            onComplete: () => {
                                cardPosition.xTransform = newTransform;
                            }
                        });
                    } else {
                        const newTransform = cardPosition.xTransform - this.initialCardWidth * this.scaleMultiplier - this.marginRight;
                        gsap.to(cardPosition.card, {
                            duration: 0.3,
                            x: newTransform,
                            onComplete: () => {
                                cardPosition.xTransform = newTransform;
                            }
                        });
                    }
                });

                this.activeIndex = this.activeIndex + 1;

                this.unlockSlider();

                // gsap.to(currentCard, {
                //     autoAlpha: 0,
                //     duration: 0.3
                // });
                // const nextCard = this.cardPositions.find(cardPosition => cardPosition.card === this.cards[this.activeIndex + 1]);

                // console.log('Sliding next', nextCard);

                // this.cardPositions.forEach(cardPosition => {
                //     const realCardDistanceFromLeft = this.calculateCardOffsetRelativeToBorder(cardPosition.cardIndex);
                //     console.log('Real card offset from left', cardPosition.card, realCardDistanceFromLeft);

                //     if (cardPosition.card === currentCard) {
                //         return;
                //     } else if (cardPosition.card === nextCard.card) {
                //         gsap.to(cardPosition.card, {
                //             x: cardPosition.xTransform + event.deltaX - realCardDistanceFromLeft,
                //             width: this.initialCardWidth * this.scaleMultiplier,
                //             onComplete: () => {}
                //         });
                //     } else {

                //     }
                // });
            }

            if (direction === 'right' && this.cards[this.activeIndex - 1]) {
                const nextCard = this.cards[this.activeIndex - 1];
            }
        } else {
            console.log('Slidechange not happened, returning slider to initial position');
            this.cardPositions.forEach(cardPosition => {
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: cardPosition.xTransform
                });
            });

            this.unlockSlider();
        }

        setTimeout(() => {
            this.filterClicks = false;
        }, this.filterClicksDelay);
    };

    resizeHandler = () => {
        this.cards.forEach(card => {
            gsap.set(card, {
                width: 'auto',
                x: 0
            });
        });
        this.initialCardWidth = this.calculateInitialCardWidth();
        this.leftBorder = this.calculateLeftBorder();
        this.marginRight = this.calculateMargin();
        this.cardPositions = this.calculateCardPositions();
        console.log('Debounced resize handler');
    };

    preventPhantomClicks = event => {
        if (event.target.matches('a') || event.target.closest('a')) {
            if (this.filterClicks) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };

    bindListeners = () => {
        console.log('Listeners bound');

        window.addEventListener('resize', debounce(this.resizeHandler, 200));

        this.touchContainer.on('panstart', this.handlePanStart);
        this.touchContainer.on('panmove', this.handlePanMove);
        this.touchContainer.on('panend', this.handlePanEnd);

        this.cardsContainer.addEventListener('click', this.preventPhantomClicks);
    };
}
