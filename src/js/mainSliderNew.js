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

    calculateCardOffsetRelativeToBorder = index => {
        if (!this.cards[index]) {
            throw new Error('Card does not exist');
        }
        const card = this.cards[index];
        const offset = card.getBoundingClientRect().left - this.leftBorder;
        console.log('Card offset relative to border', card, offset);
        return offset;
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
                xRelativeToLeft: this.calculateCardOffsetRelativeToBorder(cardIndex),
                xTransform: 0
            };
        });

        console.log('Calculated card positions', positions);

        return positions;
    };

    handlePanStart = event => {
        console.log('Panstart');

        this.filterClicks = true;
    };

    handlePanMove = event => {
        if (this.locked) {
            console.log('Panmove blocked');
            return;
        }

        this.cardPositions.forEach(cardPosition => {
            if (cardPosition.xRelativeToLeft + event.deltaX <= 0) {
                gsap.set(cardPosition.card, {
                    x: 0
                });
            } else {
                gsap.set(cardPosition.card, {
                    x: event.deltaX
                });
            }
        });

        console.log('Panmove');
    };

    handlePanEnd = event => {
        console.log('Panend');

        if (Math.abs(event.deltaX) >= this.threshold) {
            const direction = event.offsetDirection === 1 ? 'right' : 'left';

            console.log(`Slidechange happened in direction: ${direction}`);

            this.locked = true;
        } else {
            console.log('Slidechange not happened, returning slider to initial position');
            this.cardPositions.forEach(cardPosition => {
                gsap.to(cardPosition.card, {
                    duration: 0.3,
                    x: cardPosition.xTransform,
                })
            })
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
