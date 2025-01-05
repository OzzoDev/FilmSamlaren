/*Javascript for moviequiz page only*/
import { ApiClientTmdb } from "./classes/ApiClientTmdb.js";
import { dataListAsBtns, renderSpinner } from "./utilities/render.js";
import { CLAUDE_KEY, TMDB_KEY } from "./utilities/apiKey.js";
import { CLAUDE_URL } from "./utilities/endpoints.js";
import { useClickEvent } from "./utilities/events.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { filterUniqueTitles } from "./utilities/utility.js";

const genreContainer = document.getElementById("genres");
const seasonContainer = document.getElementById("seasons");
const themeContainer = document.getElementById("themes");
const generateMoviesBtn = document.getElementById("generateMovies");
const moiveContainer = document.getElementById("movies");

const apiClientGenres = new ApiClientTmdb(genreContainer, "genres");

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
  const prompt = `Suggest 10 movies that matches these genres: ${selectedCategories.genres.join(", ")} to watch in these seasons: ${selectedCategories.seasons.join(", ")} with these themes: ${selectedCategories.themes.join(", ")}. Only suggest movies with high ratings that are well know, with high revenue. Put a dollar symbol before each suggestion. It is okay if the movis dont perectly align with the requirements just suggest 10 movies as close as possible to the requirements. Only include the movie name in the response`;

  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": CLAUDE_KEY,
      "x-rapidapi-host": "claude-3-haiku-ai.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  };

  let content;

  try {
    renderSpinner(moiveContainer);

    const response = await fetch(CLAUDE_URL, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    content = result.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }

  const movieArray = content
    .split("$")
    .map((movieName) => movieName.replace("$", "").replace("\n", ""))
    .filter((line) => line.trim() !== "");

  if (movieArray) {
    const tmdbMoviePromises = movieArray.map((movieName) => {
      const params = `search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(movieName)}`;
      return new ApiClientTmdb(moiveContainer).cachedData(params);
    });

    const data = await Promise.all(tmdbMoviePromises);
    movies = filterUniqueTitles(data.flatMap((dataItem) => dataItem.results).filter((movie) => movie.poster_path && movie.vote_average > 6));

    selectedCategories.genres = [];
    selectedCategories.seasons = [];
    selectedCategories.themes = [];

    resetBtns();
    renderMovies();

    if (movies.length === 0) {
      noMoviesFound();
    }
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
