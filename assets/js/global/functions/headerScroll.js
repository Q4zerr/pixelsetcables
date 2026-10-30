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
