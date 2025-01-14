/*Common render function for all pages*/
import { useClickEvent } from "./events.js";

export function renderSpinner(parent) {
  const spinner = document.createElement("div");
  spinner.setAttribute("class", "loader");

  if (parent) {
    parent.innerHTML = "";
    parent.classList.add("relative");
    parent.appendChild(spinner);
  }
}

export function renderErrorMessage(parent, message) {
  const errorContainer = document.createElement("div");
  const errorHeader = document.createElement("h2");
  const errorBody = document.createElement("p");
  const guideList = document.createElement("ul");
  const errorFooter = document.createElement("p");

  errorContainer.setAttribute("class", "errorContainer");
  errorHeader.setAttribute("class", "errorHeader");
  errorBody.setAttribute("class", "errorBody");
  guideList.setAttribute("class", "gudieList");
  errorFooter.setAttribute("class", "errorFooter");

  const headerText = message.split(":")[0];
  const bodyText = message.split(":")[1];

  const troubleShootingSteps = ["1. Reload the page and retry.", "2. Issue could be casued be overload on server. Wait a few minutes and retry.", "3. Clear browser cache and history and retry."];

  const footerText = "If the issue persists please contact our support team. Vi appreciate your patience.";

  errorHeader.innerText = headerText;
  errorBody.innerText = bodyText;
  errorFooter.innerText = footerText;

  troubleShootingSteps.forEach((step) => {
    const guideItem = document.createElement("li");
    guideItem.setAttribute("class", "guideItem");
    guideItem.innerText = step;
    guideList.appendChild(guideItem);
  });

  if (parent) {
    parent.innerHTML = "";
    errorContainer.append(errorHeader, errorBody, guideList, errorFooter);
    parent.appendChild(errorContainer);
  }

  console.error(message);
}

export function iconValue(value, src, altAndTitle, dir) {
  const fullSrc = `../../res/icons/${src}.svg`;

  const iconContainer = document.createElement("div");
  const icon = document.createElement("img");
  const iconText = document.createElement("p");

  iconContainer.setAttribute("class", "iconContainer");
  iconContainer.setAttribute("title", altAndTitle);

  icon.setAttribute("src", fullSrc);
  icon.setAttribute("alt", altAndTitle);
  icon.setAttribute("class", "icon");

  iconText.innerText = value;

  if (!dir || dir.toLowerCase() === "left") {
    iconContainer.appendChild(icon);
    iconContainer.appendChild(iconText);
  } else {
    iconContainer.appendChild(iconText);
    iconContainer.appendChild(icon);
  }

  return iconContainer;
}

export function iconBtn(src, altTitle, callback) {
  const icon = document.createElement("img");

  const fullSrc = `../../res/icons/${src}.svg`;

  icon.setAttribute("class", "icon icon-scale");
  icon.setAttribute("src", fullSrc);
  icon.setAttribute("alt", altTitle);
  icon.setAttribute("title", altTitle);
  icon.setAttribute("role", "button");
  icon.setAttribute("tabIndex", 0);

  useClickEvent(icon, callback);

  return icon;
}

export function setInnerText(element, text, classes) {
  element.setAttribute("class", classes);
  element.innerText = text;
}

export function populateUl(parent, data, itemClass) {
  data.forEach((item) => {
    const li = document.createElement("li");
    li.setAttribute("class", itemClass);
    li.innerText = item;
    parent.appendChild(li);
  });
}

export function dataListAsBtns(dataList, containerClassName, btnClassName, callback) {
  if (dataList) {
    const container = document.createElement("div");
    container.setAttribute("class", containerClassName);

    dataList.forEach((item) => {
      const btn = document.createElement("button");
      btn.innerText = item;
      btn.setAttribute("class", btnClassName);

      useClickEvent(btn, () => {
        btn.classList.toggle("selected-btn");
        callback(item);
      });

      container.appendChild(btn);
    });
    return container;
  }
  return document.createElement("div");
}
