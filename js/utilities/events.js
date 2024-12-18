export function useClickEvent(element, callback) {
  element.addEventListener("click", () => {
    callback();
    console.log("clicked");
  });
}

export function useClickEvents(elements, callback) {
  Array.from(elements).forEach((element) => {
    element.addEventListener("click", () => {
      callback(element);
    });
  });
}

export function useScrollEvent(element, callback) {
  element.addEventListener("scroll", () => {
    callback();
  });
}
