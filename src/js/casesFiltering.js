import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CasesFiltering() {
    const elements = Array.from(document.querySelectorAll('.js-cases'));

    elements.forEach(element => {
        const links = Array.from(element.querySelectorAll('.cases__top-navigation-link'));
        const cards = Array.from(element.querySelectorAll('.cases__image-grid-card')).map(item => item.cloneNode(true));
        const grid = element.querySelector('.cases__image-grid');

        const setFilter = link => {
            if (link.classList.contains('active')) return;
            let filteredCards = [];
            if (link.hasAttribute('data-all-categories')) {
                filteredCards = cards.map(card => card.cloneNode(true));
            } else if (link.hasAttribute('data-category')) {
                filteredCards = cards.filter(card => card.getAttribute('data-category') === link.getAttribute('data-category'));
            } else {
                console.error('Items not sorted');
                return;
            }

            grid.innerHTML = '';

            links.forEach(link => link.classList.remove('active'));
            link.classList.add('active');


            grid.append(...filteredCards);

            ScrollTrigger.refresh();

            // filteredCards.forEach(card => {
            //     grid.appendChild(card);

            //     gsap.fromTo(
            //         card,
            //         {
            //             autoAlpha: 0
            //         },
            //         {
            //             autoAlpha: 1,
            //             duration: 1.7
            //         }
            //     );
            // });
        };

        links.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                setFilter(link);
            });
        });

        if (links.length) {
            setFilter(links[0]);
        } else {
            console.warn('No links');
            return;
        }
    });
}
