/*
 * #############################################################################
 * @Filename: headerScroll.js                                                  #
 * @Date: Thursday, May 25th 2026, 02:13:31                                    #
 * @Author: HiceoTanguy                                                       #
 * @Author email: webmaster@hiceo.fr                                           #
 * @Last Modified: Tuesday, February 27th 2024, 04:53:10                       #
 * @Modified By: HiceoTanguy                                                  #
 * @Copyright (c) 2026 Hiceo                                                   #
 * #############################################################################
 */

//──│ 2. headerScroll
export default function headerScroll() {
  const header = document.querySelector("#masthead");

  if (!header) {
    return;
  }

  let previousScrollY = window.scrollY;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      header.classList.remove("scrolled-top", "scrolled-bot");
      previousScrollY = currentScrollY;
      return;
    }

    if (currentScrollY < previousScrollY) {
      header.classList.add("scrolled-top");
      header.classList.remove("scrolled-bot");
    } else {
      header.classList.add("scrolled-bot");
      header.classList.remove("scrolled-top");
    }

    previousScrollY = currentScrollY;
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("load", handleScroll);
}
