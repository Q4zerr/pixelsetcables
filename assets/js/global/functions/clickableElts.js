// Allow aria keyboard navigation for custom elements
export default function cliquableElts() {
  var elements = document.querySelectorAll(".clickable-element");

  if (!elements.length) {
    return;
  }

  elements.forEach((element) => {
    element.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        element.click();
      }
    });
  });
}
