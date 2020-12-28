import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


export default function SectionsParallax() {
    const sections = Array.from(document.querySelectorAll('section'));


    sections.forEach((element, elementIndex) => {
        const nextSection = sections[elementIndex + 1];

        gsap.set(element, {
            position: 'relative',
            zIndex: elementIndex + 1
        })

        if (nextSection) {
            gsap.to(element, {
                y: 60,
                scrollTrigger: {
                    scrub: 1,
                    trigger: sections[elementIndex + 1],
                    start: 'top bottom',
                    end: 'top top'
                }
            })
        } else {
            console.log('No next section')
        }
        
    })

}