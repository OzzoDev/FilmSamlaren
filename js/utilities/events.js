export function useClickEvent(element, callback) {
  element.addEventListener("click", () => {
    callback();
    console.log("clicked");
  });
}

export function useScrollEvent(element, callback) {
  element.addEventListener("scroll", () => {
    callback();
  });
}
