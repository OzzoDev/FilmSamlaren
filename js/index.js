/*Javascript for index/start page only*/
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { MovieCard } from "./classes/MoiveCard.js";

const movieCardContainer = document.getElementById("movieCardContainer");

let movies = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
}

async function getData() {
  const apiClientTopMovies = new ApiClientImdb(movieCardContainer, "topMovies");

  movies = await apiClientTopMovies.cachedData();

  renderMovieCards();

  console.log(movies);
}

function renderMovieCards(condtion) {
  movies.forEach((movie) => {
    const movieCard = new MovieCard(movie).card();
    movieCardContainer.appendChild(movieCard);
  });
}
