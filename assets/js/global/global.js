// ________________________________________________________
// #######################################################
//──│ 1. Imports
//  └──│ 1.1. Vendors
//  └──│ 1.2. Functions
//──│ 2. Global variables
//  └──│ 2.1. jQuery
//──│ 3. Init
//  └──│ 3.1.
// ________________________________________________________
// #######################################################

import headerScroll from "./functions/headerScroll";
import top from "./functions/top";
import darkMode from "./functions/darkMode";
import scrollIndicator from "./functions/scrollIndicator";
import clickableElts from "./functions/clickableElts";

document.addEventListener("DOMContentLoaded", init);

function init() {
  headerScroll();
  top();
  darkMode();
  scrollIndicator();
  clickableElts();

  /**
   * GSAP Loading
   */
  const shouldLoadGSAP = document.querySelector(
    ".gsap-x-right, .gsap-x-left, .gsap-y-top, .gsap-y-bottom",
  );

  if (shouldLoadGSAP) {
    import(
      /*  webpackChunkName: "gsap-translate" */
      "./functions/gsapTranslate"
    ).then(({ default: gsapTranslate }) => {
      gsapTranslate();
    });
  }
}
