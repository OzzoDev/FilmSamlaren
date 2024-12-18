/*Javascript for index/start page only*/
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { useScrollEvent, useClickEvents, useInputEvent } from "./utilities/events.js";

const movieCardContainer = document.getElementById("movieCardContainer");
const sortOptions = document.getElementById("sortOptions");
const searchInput = document.getElementById("searchInput");

let visibleMovies = 50;
let movies = [];
let sortOrder = 0;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
  populateSortOptions();
  useClickEvents(sortOptions.children, setSortOrder);
  useScrollEvent(movieCardContainer, appendMovies);
  useInputEvent(searchInput, searchMovies);
}

async function getData() {
  const apiClientTopMovies = new ApiClientImdb(movieCardContainer, "topMovies");

  movies = await apiClientTopMovies.cachedData();

  renderMovies();
}

function searchMovies() {
  const searchQuery = searchInput.value.trim().toLowerCase();

  if (searchQuery) {
    movies = [...movies].sort((a, b) => {
      const aValue = String(a["title"]).toLowerCase();
      const bValue = String(b["title"]).toLowerCase();

      const aIncludesQuery = aValue.includes(searchQuery);
      const bIncludesQuery = bValue.includes(searchQuery);

      if (aIncludesQuery && !bIncludesQuery) return -1;
      if (!aIncludesQuery && bIncludesQuery) return 1;

      return sortBy(a, b, sortOrder);
    });
  }

  renderMovies();
}

function setSortOrder(option) {
  const options = Array.from(sortOptions.children).forEach((opt) => opt.classList.remove("selected"));

  option.classList.add("selected");

  sortOrder = option.value;
  sortMovies(sortOrder);

  searchMovies();
}

function sortMovies() {
  movies = [...movies].sort((a, b) => {
    return sortBy(a, b);
  });
}

function sortBy(a, b) {
  switch (sortOrder) {
    case 0:
      return a.title.localeCompare(b.title);
    case 1:
      return b.title.localeCompare(a.title);
    case 2:
      return b.averageRating - a.averageRating;
    case 3:
      return a.averageRating - b.averageRating;
    case 4:
      return b.startYear - a.startYear;
    case 5:
      return a.startYear - b.startYear;
    case 6:
      return b.runtimeMinutes - a.runtimeMinutes;
    case 7:
      return a.runtimeMinutes - b.runtimeMinutes;
    default:
      return 0;
  }
}

function populateSortOptions() {
  const options = ["A- Z", "Z - A", "High - Low Rating", "Low - High Rating", "New - Old", "Old - New", "High - Low Duration", "Low - High Duration"];

  options.forEach((opt, index) => {
    const animationDelay = index * 0.1;
    const option = document.createElement("li");
    const optionText = document.createElement("p");

    option.setAttribute("class", "sortOption");
    optionText.setAttribute("class", "sortOptionText");

    optionText.innerText = opt;
    option.style.animationDelay = `${animationDelay}s`;
    option.setAttribute("value", index);

    option.appendChild(optionText);
    sortOptions.appendChild(option);
  });
}

function renderMovies() {
  movieCardContainer.innerHTML = "";
  visibleMovies = 50;

  for (let i = 0; i < visibleMovies; i++) {
    const movie = movies[i];
    const movieCard = new MovieCard(movie).card();
    movieCardContainer.appendChild(movieCard);
  }
}

function appendMovies() {
  if (visibleMovies < movies.length) {
    const start = visibleMovies;
    const end = visibleMovies + 10;

    visibleMovies += 10;

    for (let i = start; i < end; i++) {
      const movie = movies[i];
      const movieCard = new MovieCard(movie).card();
      movieCardContainer.appendChild(movieCard);
    }
  }
}
