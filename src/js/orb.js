import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Orb() {
    const contactUs = document.querySelector('.contact-us');
    const contactUsOrb = document.querySelector('.contact-us__orb');
    const contactUsOrbInner = document.querySelector('.contact-us__orb-inner');

    const COLOR_CHANGE_SPEED = 2;

    function followMouse(e) {
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = parseInt(e.clientX - rect.left, 10);
        const offsetY = parseInt(e.clientY - rect.top, 10);
        // console.log({
        //     left: offsetX,
        //     top: offsetY,
        //     target: e.currentTarget
        // });
        gsap.to(contactUsOrb, {
            duration: 0.3,
            left: offsetX,
            top: offsetY,
            overwrite: true
        });
    }

    function mouseLeave() {
        console.log('Mouseleave');

        gsap.to(contactUsOrb, {
            duration: 0.6,
            left: '50%',
            top: '50%',
            overwrite: true
        });
    }

    if (contactUs && contactUsOrb && contactUsOrbInner) {
        contactUs.addEventListener('mousemove', followMouse);

        // contactUs.addEventListener('mouseenter', () => {
        //     console.log('Mouse enter');
        // });
        contactUs.addEventListener('mouseleave', mouseLeave);

        const colorChangeTimeline = gsap.timeline({ repeat: -1 });

        gsap.set(contactUsOrbInner, {
            '--first-color': '#ffec45',
            '--second-color': '#ff998b',
            autoAlpha: 0
        });

        colorChangeTimeline
            .to(contactUsOrbInner, {
                duration: COLOR_CHANGE_SPEED,
                ease: 'none',
                '--first-color': '#FF7245',
                '--second-color': '#94FF8B'
            })
            .to(contactUsOrbInner, {
                duration: COLOR_CHANGE_SPEED,
                ease: 'none',
                '--first-color': '#5FFF45',
                '--second-color': '#8BB3FF'
            })
            .to(contactUsOrbInner, {
                duration: COLOR_CHANGE_SPEED,
                ease: 'none',
                '--first-color': '#45DEFF',
                '--second-color': '#B78BFF'
            })
            .to(contactUsOrbInner, {
                duration: COLOR_CHANGE_SPEED,
                ease: 'none',
                '--first-color': '#6A45FF',
                '--second-color': '#FF8BC3'
            })
            .to(contactUsOrbInner, {
                duration: COLOR_CHANGE_SPEED,
                ease: 'none',
                '--first-color': '#ffec45',
                '--second-color': '#ff998b'
            });


        

        gsap.to(contactUsOrbInner, {
            autoAlpha: 1,
            duration: 1,
            scrollTrigger: {
                start: 'top center',
                end: 'bottom top',
                trigger: contactUsOrbInner,
                toggleActions: 'play reverse play reverse'
            }
        })
    }
}
