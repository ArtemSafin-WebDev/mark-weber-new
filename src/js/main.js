import polyfills from './polyfills';
import detectTouch from './detectTouch';
import MainSlider from './mainSliderNew';
import IntroSlider from './introSlider';
import AnchorLinks from './anchorLinks';
import SectionsParallax from './sectionsParallax';
import CasesFiltering from './casesFiltering';

document.addEventListener('DOMContentLoaded', function() {
    polyfills();
    detectTouch();
    IntroSlider();
    AnchorLinks();
    SectionsParallax();
    CasesFiltering();
    window.mainSlider = new MainSlider(document.querySelector('.js-main-slider'));


});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    setTimeout(() => document.body.classList.add('animatable'), 300)
})
