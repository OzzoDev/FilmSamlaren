/*Common render function for all pages*/

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
