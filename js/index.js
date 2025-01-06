/*Javascript for index/start page only*/
import { ApiClientTmdb } from "./classes/ApiClientTmdb.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { useClickEvent, useClickEvents, useInputEvent } from "./utilities/events.js";
import { filterUniqueTitles } from "./utilities/utility.js";
import { setInnerText } from "./utilities/render.js";
import { ApiClientClaude } from "./classes/ApiClientClaude.js";

const movieContainer = document.getElementById("movieCardContainer");
const showGenresBtn = document.getElementById("categoriesBtn");
const hideGenresBtn = document.getElementById("hideGenresBtn");
const genreContainer = document.getElementById("genresContainer");
const genreList = document.getElementById("genres");
const searchInput = document.getElementById("searchInput");
const sortOptions = document.getElementById("sortOptions");
const filterMessage = document.getElementById("filterMessage");
const supriseBtn = document.getElementById("surprise");

const apiClientGenres = new ApiClientTmdb(movieContainer, "genres");

let movies = [];
let genres = [];

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
  populateSortOptions();
  useClickEvent(showGenresBtn, showGenres);
  useClickEvent(hideGenresBtn, hideGenres);
  useClickEvent(supriseBtn, generateMovies);
  useClickEvents(sortOptions.children, sortMoives);
  useInputEvent(searchInput, searchMovies);
}

async function getData() {
  const genreData = await apiClientGenres.getGenres();
  genres = genreData.genres;

  await getAllMovies();

  renderMovies(movies);
  populateGenres(["All", ...genres.map((genre) => genre.name)]);
}

async function getAllMovies() {
  const moviesPromises = [...genres].map((genre) => new ApiClientTmdb(movieContainer, `${genre.name}Movies`).getMoviesByGenre(genre.id));
  const moviesData = await Promise.all(moviesPromises);
  movies = filterUniqueTitles(moviesData.flatMap((data) => data.results));
}

async function getMoviesByGenre(genre) {
  if (genre === "All") {
    await getAllMovies();
  } else {
    const moviesDataByGenre = await apiClientGenres.getMoviesByGenre(genres.find((gen) => gen.name === genre).id);
    movies = moviesDataByGenre.results;
  }
  renderMovies(movies);
}

async function generateMovies() {
  movies = await new ApiClientClaude(movieContainer).generateMovies();
  renderMovies(movies);
}

function showGenres() {
  window.scrollTo({ top: 0 });
  document.body.style.height = "100dvh";
  document.body.style.overflow = "hidden";
  genreContainer.classList.remove("hidden");
}

function hideGenres() {
  window.scrollTo({ top: 1000 });
  document.body.style.height = "auto";
  document.body.style.overflow = "auto";
  genreContainer.classList.add("hidden");
}

function searchMovies() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  const matchingMovies = [...movies].filter((movie) => movie.original_title.toLowerCase().includes(searchQuery.toLowerCase()));

  setInnerText(filterMessage, "", "filterMessage");

  if (searchQuery.length > 0) {
    if (matchingMovies.length > 0) {
      setInnerText(filterMessage, `Found ${matchingMovies.length} ${matchingMovies.length === 1 ? "movie" : "movies"} by name of ${searchQuery}`, "filterMessage success");
    } else {
      setInnerText(filterMessage, `Found no movies by name of ${searchQuery}`, "filterMessage error");
    }
  }

  renderMovies(matchingMovies, true);
}

function sortMoives(option) {
  Array.from(sortOptions.children).forEach((opt) => opt.classList.remove("selected"));
  option.classList.add("selected");

  switch (option.value) {
    case 0:
      movies = movies.sort((a, b) => b.vote_average - a.vote_average);
      break;
    case 1:
      movies = movies.sort((a, b) => a.vote_average - b.vote_average);
      break;
    case 2:
      movies = movies.sort((a, b) => b.popularity - a.popularity);
      break;
    case 3:
      movies = movies.sort((a, b) => a.popularity - b.popularity);
      break;
    case 4:
      movies = movies.sort((a, b) => b.vote_count - a.vote_count);
      break;
    case 5:
      movies = movies.sort((a, b) => a.vote_count - b.vote_count);
      break;
    case 6:
      movies = movies.sort((a, b) => parseInt(b.release_date) - parseInt(a.release_date));
      break;
    case 7:
      movies = movies.sort((a, b) => parseInt(a.release_date) - parseInt(b.release_date));
      break;
  }

  renderMovies(movies);
}

function populateGenres(genreNames) {
  genreNames.forEach((gen, index) => {
    const animationDelay = index * 0.04;
    const genre = document.createElement("li");
    const genreText = document.createElement("p");

    genre.setAttribute("class", "genre");
    genreText.setAttribute("class", "genreText");

    genreText.innerText = gen;
    genre.style.animationDelay = `${animationDelay}s`;

    genre.addEventListener("click", () => {
      hideGenres();
      getMoviesByGenre(gen);
    });

    genre.appendChild(genreText);
    genreList.appendChild(genre);
  });
}

function populateSortOptions() {
  const options = ["High - Low Rating", "Low - High Rating", "High - Low Popularity", "Low - High Popularity", "Many - Few Votes", "Few - Many Votes", "New - Old", "Old - New"];

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

function renderMovies(moviesToRender, bySearch) {
  if (moviesToRender.length > 0 || bySearch) {
    movieContainer.innerHTML = "";
    moviesToRender.forEach((movie) => movieContainer.appendChild(new MovieCard(movie).card()));
  }
}
