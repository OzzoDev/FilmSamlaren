/*Common javascript for all pages*/
import { useClickEvent } from "./utilities/events.js";

const icon = document.getElementById("menuToggle");
const navUl = document.getElementById("navUl");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  useClickEvent(icon, toggleMenu);
}

function toggleMenu() {
  icon.classList.toggle("open");
  navUl.classList.toggle("show-ul");
}
