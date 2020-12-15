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
        this.animating = false;
        this.filterClicks = false;
        this.filterClicksDelay = 200;
        this.activeIndex = 0;
        this.threshold = 250;
        this.scaleMultiplier = 1.4;
        this.initialCardWidth = this.calculateInitialCardWidth();
        this.leftBorder = this.calculateLeftBorder();
        this.touchContainer = new Hammer(this.cardsContainer);
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

    handlePanStart = () => {};

    handlePanMove = () => {};

    handlePanEnd = () => {};

    resizeHandler = () => {
        this.initialCardWidth = this.calculateInitialCardWidth();
        this.leftBorder = this.calculateLeftBorder();
        console.log('Debounced resize handler');
    };

    bindListeners = () => {
        console.log('Listeners bound');

        window.addEventListener('resize', debounce(this.resizeHandler, 200));

        this.touchContainer.on('panstart', event => {
            console.log('Panstart');

            this.filterClicks = true;
        });
        this.touchContainer.on('panmove', event => {
            console.log('Panmove');
        });
        this.touchContainer.on('panend', event => {
            console.log('Panend');


            if (Math.abs(event.deltaX) >= this.threshold) {
                console.log('Threshold reached');

                
            }


            setTimeout(() => {
                this.filterClicks = false;
            }, this.filterClicksDelay);
        });


        this.cardsContainer.addEventListener('click', event => {
            if (event.target.matches('a') || event.target.closest('a')) {
                if (this.filterClicks) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        })
    };
}
