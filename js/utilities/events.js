export function useScrollEvent(element, callback) {
  element.addEventListener("scroll", () => {
    callback();
  });
}
