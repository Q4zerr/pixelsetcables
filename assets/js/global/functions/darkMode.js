/*
 * #############################################################################
 * @Filename: darkMode.js                                                      #
 * @Date: Friday, February 23rd 2024, 04:03:2                                  #
 * @Author: TBergerDev                                                         #
 * @Author email: tristan.berger.dev@gmail.com                                 #
 * @Last Modified: Friday, February 23rd 2024, 05:02:25                        #
 * @Modified By: TBergerDev                                                    #
 * @Copyright (c) 2024 -                                                       #
 * #############################################################################
 */
export default function darkMode() {
  // one switch for desktop and one for mobile
  let TogglesTheme = document.querySelectorAll(".toggle-theme");

  // get starting theme, set previously with localStorage in header script
  let startingTheme = document.documentElement.getAttribute("data-theme");

  // if starting theme is dark, toggle switches
  if (startingTheme == "dark") {
    TogglesTheme.forEach((ToogleTheme) => {
      switchStyle(ToogleTheme, "dark");
    });
  }

  TogglesTheme.forEach((ToogleTheme) => {
    ToogleTheme.addEventListener("click", (e) => {
      if (e.currentTarget.getAttribute("data") == "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        switchStyle(e.currentTarget, "dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        switchStyle(e.currentTarget, "light");
        localStorage.setItem("theme", "light");
      }
      // put the other switch in the same position
      TogglesTheme.forEach((ToogleTheme) => {
        ToogleTheme.setAttribute("data", e.currentTarget.getAttribute("data"));
      });
    });
  });

  function switchStyle(el, theme) {
    el.setAttribute("data", theme);
    if (theme == "light") {
      el.innerHTML = "de <span> jour</span>...";
    } else if (theme == "dark") {
      el.innerHTML = "comme de <span> nuit</span>...";
    }
  }
}
