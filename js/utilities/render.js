/*Common render function for all pages*/
import { formatLargeNumber } from "./utility.js";
import { useClickEvent } from "./events.js";

export function renderSpinner(parent) {
  const spinner = document.createElement("div");
  spinner.setAttribute("class", "loader");

  if (parent) {
    parent.innerHTML = "";
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
  iconContainer.setAttribute("title", formatLargeNumber(altAndTitle));

  icon.setAttribute("src", fullSrc);
  icon.setAttribute("alt", formatLargeNumber(altAndTitle));
  icon.setAttribute("class", "icon");

  iconText.innerText = formatLargeNumber(value);

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

export function setIcon(icon, src, altTitle) {
  icon.setAttribute("src", `../../res/icons/${src}.svg`);
  icon.setAttribute("alt", altTitle);
  icon.setAttribute("title", altTitle);
}

export function populateUl(parent, data, itemClass) {
  data.forEach((item) => {
    const li = document.createElement("li");
    li.setAttribute("class", itemClass);
    li.innerText = item;
    parent.appendChild(li);
  });
}

export function ulWithHeader(data, headerText, containerClass, headerClass, listClass, itemClass) {
  const container = document.createElement("div");
  const header = document.createElement("h2");
  const ul = document.createElement("ul");

  container.setAttribute("class", containerClass);
  header.setAttribute("class", headerClass);
  ul.setAttribute("class", listClass);

  header.innerText = headerText;

  data.forEach((item) => {
    const li = document.createElement("li");
    li.setAttribute("class", itemClass);
    li.innerText = item;
    ul.appendChild(li);
  });

  container.append(header, ul);

  return container;
}

export function valueWithHeader(value, headerText, containerClass, headerClass, valueClass) {
  const container = document.createElement("div");
  const header = document.createElement("h2");
  const text = document.createElement("p");

  container.setAttribute("class", containerClass);
  header.setAttribute("class", headerClass);
  text.setAttribute("class", valueClass);

  header.innerText = headerText;
  text.innerText = value;

  container.append(header, text);

  return container;
}

export function iconLink(url, src, altTitle, className) {
  const link = document.createElement("a");
  const icon = document.createElement("img");

  link.setAttribute("class", className);
  link.setAttribute("title", altTitle);
  link.setAttribute("href", url);
  link.setAttribute("target", "_blank");

  icon.setAttribute("src", `../../res/icons/${src}.svg`);
  icon.setAttribute("class", "icon icon-scale");
  icon.setAttribute("alt", altTitle);

  link.appendChild(icon);

  return link;
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
