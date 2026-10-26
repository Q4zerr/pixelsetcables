/*
 * #############################################################################
 * @Filename: top.js                                                           #
 * @Date: Friday, August 5th 2022, 01:42:38                                    #
 * @Author: HiceoTanguy                                                       #
 * @Author email: webmaster@hiceo.fr                                           #
 * @Last Modified: Wednesday, February 28th 2024, 09:41:21                     #
 * @Modified By: HiceoTanguy                                                  #
 * @Copyright (c) 2026 Hiceo                                                   #
 * #############################################################################
 */

//──│ 1. Imports
//  └──│ 1.1. Vendors

//──│ 2. Scroll to top button
export default function top() {
  const topButton = document.querySelector(".footerTopButton");
  const topScroll = document.querySelector(".footerTopScroll");
  const footerNavigation = document.querySelector(".footerNavigation");

  const elements = [topButton, topScroll].filter(Boolean);

  if (!elements.length) {
    return;
  }

  if (topButton) {
    topButton.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  function setHidden(isHidden) {
    elements.forEach((element) => {
      element.classList.toggle("is-hidden", isHidden);
    });
  }

  function setAbsolute(isAbsolute) {
    elements.forEach((element) => {
      if (isAbsolute) {
        element.style.position = "absolute";
      } else {
        element.style.removeProperty("position");
      }
    });
  }

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportBottom = scrollTop + window.innerHeight;

    setHidden(scrollTop <= 0);

    if (!footerNavigation) {
      return;
    }

    const footerTop =
      footerNavigation.getBoundingClientRect().top + window.scrollY;

    setAbsolute(viewportBottom > footerTop);
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("load", handleScroll);

  handleScroll();
}
