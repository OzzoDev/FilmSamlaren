/*Javascript for index/start page only*/
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { useScrollEvent, useClickEvents } from "./utilities/events.js";
import { normalSort, reverseSort } from "./utilities/utility.js";

const movieCardContainer = document.getElementById("movieCardContainer");
const sortOptions = document.getElementById("sortOptions");

let visibleMovies = 50;
let movies = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
  populateSortOptions();
  useClickEvents(sortOptions.children, setSortOrder);
  useScrollEvent(movieCardContainer, appendMovies);
}

async function getData() {
  const apiClientTopMovies = new ApiClientImdb(movieCardContainer, "topMovies");

  movies = await apiClientTopMovies.cachedData();

  renderMovies();

  // console.log(movies);
}

function setSortOrder(option) {
  const sortOrder = option.value;
  sortMovies(sortOrder);
}

function sortMovies(sortOrder) {
  switch (sortOrder) {
    case 0:
      movies = normalSort(movies, "title");
      break;
    case 1:
      movies = reverseSort(movies, "title");
      break;
    case 2:
      movies = reverseSort(movies, "averageRating");
      break;
    case 3:
      movies = normalSort(movies, "averageRating");
      break;
    case 4:
      movies = reverseSort(movies, "startYear");
      break;
    case 5:
      movies = normalSort(movies, "startYear");
      break;
    case 6:
      movies = reverseSort(movies, "runtimeMinutes");
      break;
    case 7:
      movies = normalSort(movies, "runtimeMinutes");
      break;
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

function renderMovies(condtion) {
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
