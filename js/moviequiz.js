/*Javascript for moviequiz page only*/
import { ApiClientTmdb } from "./classes/ApiClientTmdb.js";
import { dataListAsBtns } from "./utilities/render.js";
import { useClickEvent } from "./utilities/events.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { ApiClientClaude } from "./classes/ApiClientClaude.js";

const genreContainer = document.getElementById("genres");
const seasonContainer = document.getElementById("seasons");
const themeContainer = document.getElementById("themes");
const generateMoviesBtn = document.getElementById("generateMovies");
const moiveContainer = document.getElementById("movies");

const apiClientGenres = new ApiClientTmdb(moiveContainer, "genres");

let genres = [];
let movies = [];

const selectedCategories = {
  genres: [],
  seasons: [],
  themes: [],
};

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
  useClickEvent(generateMoviesBtn, generateMovies);
}

async function getData() {
  const promises = [apiClientGenres.getGenres()];

  const data = await Promise.all(promises);

  genres = data[0].genres.map((genre) => genre.name) || [];

  renderGenreBtns();
  renderSeasonBtns();
  renderThemeBtns();
}

async function generateMovies() {
  const params = `${selectedCategories.genres.join(", ")} to watch in these seasons: ${selectedCategories.seasons.join(", ")} with these themes: ${selectedCategories.themes.join(", ")}`;

  movies = await new ApiClientClaude(moiveContainer).generateMovies(params);

  selectedCategories.genres = [];
  selectedCategories.seasons = [];
  selectedCategories.themes = [];

  resetBtns();
  renderMovies();

  if (movies.length === 0) {
    noMoviesFound();
  }
}

function noMoviesFound() {
  moiveContainer.innerHTML = "";
  const message = document.createElement("p");
  message.setAttribute("class", "error");
  message.innerHTML = "No movies found, please try again";
}

function resetBtns() {
  const btns = document.getElementsByClassName("btn");
  Array.from(btns).forEach((btn) => btn.classList.remove("selected-btn"));
}

function renderGenreBtns() {
  const spinner = document.getElementsByClassName("loader")[0];
  if (spinner) {
    spinner.remove();
  }
  const selectdGenre = (genre) => {
    if (!selectedCategories.genres.includes(genre)) {
      selectedCategories.genres.push(genre);
    }
  };
  genreContainer.appendChild(dataListAsBtns(genres, "genreBtns btn-container", "genreBtn btn", selectdGenre));
}

function renderSeasonBtns() {
  const selectSeason = (season) => {
    if (!selectedCategories.seasons.includes(season)) {
      selectedCategories.seasons.push(season);
    }
  };

  seasonContainer.appendChild(dataListAsBtns(["Winter", "Spring", "Summer", "Autumn"], "seasonsBtn btn-container", "seasonBtn btn", selectSeason));
}

function renderThemeBtns() {
  const selectTheme = (interest) => {
    if (!selectedCategories.themes.includes(interest)) {
      selectedCategories.themes.push(interest);
    }
  };

  themeContainer.appendChild(dataListAsBtns(["Gaming", "Sports", "Travel", "Food & Cooking", "Fashion", "Technology", "Music", "Art & Design", "History", "Science", "Nature & Wildlife", "Fitness & Health", "Literature", "Photography", "Social Issues", "Psychology", "Adventure Activities", "Pets & Animals", "Mysticism & Spirituality", "Comedy & Humor"], "interestsBtn btn-container", "interestBtn btn", selectTheme));
}

function renderMovies() {
  moiveContainer.innerHTML = "";
  movies.forEach((movie) => {
    moiveContainer.appendChild(new MovieCard(movie).card());
  });
}
