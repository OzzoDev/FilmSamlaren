/*Javascript for index/start page only*/
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { ApiClientOmdb } from "./classes/ApiClientOmdb.js";
import { IMDB_URL } from "./utilities/endpoints.js";
import { BASE_TTL } from "./utilities/ttl.js";
import { MOVIESBYGENRES_LSK } from "./utilities/keys.js";
import { cacheData } from "./utilities/utility.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { useScrollEvent, useClickEvent, useClickEvents, useInputEvent } from "./utilities/events.js";
import { sortAz } from "./utilities/utility.js";
import { setInnerText } from "./utilities/render.js";

const movieCardContainer = document.getElementById("movieCardContainer");
const showGenresBtn = document.getElementById("categoriesBtn");
const hideGenresBtn = document.getElementById("hideGenresBtn");
const genreContainer = document.getElementById("genresContainer");
const genreList = document.getElementById("genres");
const searchInput = document.getElementById("searchInput");
const sortOptions = document.getElementById("sortOptions");
const filterMessage = document.getElementById("filterMessage");

const apiClientTopMovies = new ApiClientImdb(movieCardContainer, "Top 250");
const apiClientGenres = new ApiClientImdb(movieCardContainer, "genres");

let visibleMovies = 50;
let movies = [];
let genres = [];
let moviesByGenres = [];
let selectedSortOrder = 0;
let selectGenre;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
  populateSortOptions();
  useClickEvent(showGenresBtn, showGenres);
  useClickEvent(hideGenresBtn, hideGenres);
  useClickEvents(sortOptions.children, setSortOrder);
  useScrollEvent(movieCardContainer, appendMovies);
  useInputEvent(searchInput, searchMovies);
}

async function getData() {
  const promises = [apiClientTopMovies.cachedData(), apiClientGenres.cachedData()];

  const response = await Promise.all(promises);

  movies = response[0];
  genres = sortAz(response[1]);

  genres.unshift("Top 250");

  renderMovies();
  populateGenres();

  searchAllGenres();
}

async function searchAllGenres() {
  const genreSearchPromises = [];
  let moviesByAllGenres = [];

  genres.forEach((genre, index) => {
    if (index > 0) {
      genreSearchPromises.push(new ApiClientImdb(undefined, "searchByGenre", `&genre=${genre}`, MOVIESBYGENRES_LSK).losseData());
    }
  });

  const response = await Promise.all(genreSearchPromises);

  const fetchableGenres = [...genres].slice(1);
  const isFetchedData = response.every((res) => res.results);

  if (isFetchedData) {
    response.forEach((data, index) => {
      if (data.results) {
        const movieIDs = data.results.map((movie) => ({ id: movie.id }));
        moviesByAllGenres.push({ movies: movieIDs, genre: fetchableGenres[index] });
      } else {
        moviesByAllGenres.push({ movies: data, genre: fetchableGenres[index] });
      }
    });
    cacheData(MOVIESBYGENRES_LSK, moviesByAllGenres, BASE_TTL);
  } else {
    moviesByAllGenres = response[0];
  }
  moviesByGenres = moviesByAllGenres;
  console.log("All genres movies: ", moviesByGenres);
}

async function getMoviesByGenre(genre) {
  if (genre === "Top 250") {
    const top250 = await apiClientTopMovies.cachedData();
    movies = top250;
    renderMovies();
  } else {
    const selectedMoviesByGenre = moviesByGenres.find((movie) => movie.genre === genre);

    console.log("sel", selectedMoviesByGenre.movies);

    const moviePromises = selectedMoviesByGenre.movies.map((movie) => {
      if (movie && movie.id) {
        return new ApiClientImdb(movieCardContainer, `${IMDB_URL}/${movie.id}`).cachedData();
      }
    });
    const moviesByGenre = await Promise.all(moviePromises);

    movies = [];

    moviesByGenre.forEach((movie) => {
      const isDefined = movie.primaryImage && typeof movie.primaryImage === "string" && movie.primaryImage.startsWith("http");
      if (isDefined) {
        movies.push(movie);
      }
    });

    const highLowRatingOption = sortOptions.children[2];
    setSortOrder(highLowRatingOption);

    renderMovies();
  }
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

async function searchMovies() {
  const searchQuery = searchInput.value.trim().toLowerCase();

  if (searchQuery.length > 4) {
    setInnerText(filterMessage, `Searching movies by name of ${searchQuery}...`, "filterMessage success");

    const searchedMovies = await new ApiClientOmdb(movieCardContainer).searchMovies(searchQuery, 1);

    movies = [];

    searchedMovies.forEach((movie) => {
      const isDefined = movie.primaryImage && typeof movie.primaryImage === "string" && movie.primaryImage.startsWith("http");
      if (isDefined) {
        movies.push(movie);
      }
    });

    if (movies.length === 0) {
      setInnerText(filterMessage, `No movies found by name of ${searchQuery}`, "filterMessage error");
    } else {
      setInnerText(filterMessage, `Found ${movies.length} movies by name of ${searchQuery}`, "filterMessage success");
    }
  } else {
    const top250 = await apiClientTopMovies.cachedData();
    movies = top250;

    setInnerText(filterMessage, "Search query must be at least 5 characters", "filterMessage error");
    if (searchQuery.length === 0) {
      setInnerText(filterMessage, "", "filterMessage");
    }
  }
  renderMovies();
}

function setSortOrder(option) {
  Array.from(sortOptions.children).forEach((opt) => opt.classList.remove("selected"));

  option.classList.add("selected");

  selectedSortOrder = option.value;
  sortMovies(selectedSortOrder);

  renderMovies();
}

function sortMovies() {
  movies = [...movies].sort((a, b) => {
    return sortBy(a, b);
  });
}

function sortBy(a, b) {
  switch (selectedSortOrder) {
    case 0:
      return b.averageRating - a.averageRating;
    case 1:
      return a.averageRating - b.averageRating;
    case 2:
      return b.startYear - a.startYear;
    case 3:
      return a.startYear - b.startYear;
    case 4:
      return b.runtimeMinutes - a.runtimeMinutes;
    case 5:
      return a.runtimeMinutes - b.runtimeMinutes;
    default:
      return 0;
  }
}

function populateGenres() {
  genres.forEach((gen, index) => {
    const animationDelay = index * 0.04;
    const genre = document.createElement("li");
    const genreText = document.createElement("p");

    genre.setAttribute("class", "genre");
    genreText.setAttribute("class", "genreText");

    genreText.innerText = gen;
    genre.style.animationDelay = `${animationDelay}s`;

    genre.addEventListener("click", () => {
      selectGenre = gen;
      hideGenres();
      getMoviesByGenre(gen);
    });

    genre.appendChild(genreText);
    genreList.appendChild(genre);
  });
}

function populateSortOptions() {
  const options = ["High - Low Rating", "Low - High Rating", "New - Old", "Old - New", "High - Low Duration", "Low - High Duration"];

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
  visibleMovies = Math.min(movies.length, 50);

  if (visibleMovies > 0) {
    movieCardContainer.innerHTML = "";
    for (let i = 0; i < visibleMovies; i++) {
      const movie = movies[i];

      const movieCard = new MovieCard(movie).card();
      movieCardContainer.appendChild(movieCard);
    }
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
