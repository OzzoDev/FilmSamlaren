/*Javascript for index/start page only*/
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { useScrollEvent } from "./utilities/events.js";

const movieCardContainer = document.getElementById("movieCardContainer");

let visibleMovies = 50;
let movies = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
  useScrollEvent(movieCardContainer, appendMovies);
}

async function getData() {
  const apiClientTopMovies = new ApiClientImdb(movieCardContainer, "topMovies");

  movies = await apiClientTopMovies.cachedData();

  renderMovies();

  console.log(movies);
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
