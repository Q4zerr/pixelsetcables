/*
 * #############################################################################
 * @Filename: scrollIndicator.js                                               #
 * @Date: Wednesday, February 28th 2024, 09:36:8                               #
 * @Author: HiceoTanguy                                                       #
 * @Author email: webmaster@hiceo.fr                                           #
 * @Last Modified: Wednesday, February 28th 2024, 09:57:38                     #
 * @Modified By: HiceoTanguy                                                  #
 * @Copyright (c) 2024 Hiceo                                                   #
 * #############################################################################
 */

//──│ 2. scrollIndicator
export default function scrollIndicator() {
  const progress = document.querySelector(".progress");
  const container = document.querySelector(".scroll-indicator-container");
  // Check if both progress and container elements exist
  if (!progress || !container) {
    return;
  }

  let mainPage = document.querySelector("body");

  function calculateDocHeight() {
    return mainPage.scrollHeight - window.innerHeight;
  }

  function setScrollPerc() {
    const docHeight = calculateDocHeight();

    if (docHeight <= 0) {
      return;
    }

    const top = window.pageYOffset || document.documentElement.scrollTop;
    let perc = Math.ceil((top * 100) / docHeight);

    perc = Math.min(perc, 100);

    container.setAttribute("data-scroll", perc);
    progress.style.strokeDashoffset = 132 - (perc / 100) * 132;
  }

  window.addEventListener("scroll", setScrollPerc, { passive: true });
  window.addEventListener("load", setScrollPerc);
  window.addEventListener("click", setScrollPerc);
}
