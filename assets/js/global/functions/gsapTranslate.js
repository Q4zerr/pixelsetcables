import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SELECTOR = ".gsap-x-right, .gsap-x-left, .gsap-y-top, .gsap-y-bottom";

let animations = [];
let resizeTimeout = null;
let isInitialized = false;

export default function gsapTranslate() {
  if (isInitialized) {
    return;
  }

  const elements = document.querySelectorAll(SELECTOR);

  if (!elements.length) {
    return;
  }

  isInitialized = true;

  function cleanup() {
    animations.forEach((animation) => {
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }

      animation.kill();
    });

    animations = [];
  }

  function getTranslationProperties(element) {
    const isMobile = window.innerWidth < 1024;
    const dataAttr = isMobile ? "data-translate-mobile" : "data-translate";
    const translateValue = parseInt(element.getAttribute(dataAttr), 10) || 0;

    if (element.classList.contains("gsap-x-left")) {
      return { x: -translateValue };
    }

    if (element.classList.contains("gsap-y-top")) {
      return { y: -translateValue };
    }

    if (element.classList.contains("gsap-y-bottom")) {
      return { y: translateValue };
    }

    if (element.classList.contains("gsap-x-right")) {
      return { x: translateValue };
    }

    return {};
  }

  function applyTranslate() {
    cleanup();

    elements.forEach((element) => {
      gsap.set(element, {
        clearProps: "transform",
      });

      const animation = gsap.to(element, {
        ...getTranslationProperties(element),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      animations.push(animation);
    });

    ScrollTrigger.refresh();
  }

  function handleResize() {
    window.clearTimeout(resizeTimeout);

    resizeTimeout = window.setTimeout(() => {
      applyTranslate();
    }, 150);
  }

  applyTranslate();

  window.addEventListener("resize", handleResize, { passive: true });
}
