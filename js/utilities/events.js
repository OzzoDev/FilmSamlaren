export function useClickEvent(element, callback) {
  element.addEventListener("click", () => {
    if (typeof callback === "function") {
      callback();
    }
  });
}

export function useClickEvents(elements, callback) {
  Array.from(elements).forEach((element) => {
    element.addEventListener("click", () => {
      callback(element);
    });
  });
}

export function useInputEvent(element, callback) {
  element.addEventListener("input", () => {
    callback();
  });
}

export function useScrollEvent(element, callback) {
  element.addEventListener("scroll", () => {
    callback();
  });
}
