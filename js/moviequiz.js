/*Javascript for moviequiz page only*/
import { ApiClientTmdb } from "./classes/ApiClientTmdb.js";
import { dataListAsBtns } from "./utilities/render.js";
import { CLAUDE_KEY } from "./utilities/apiKey.js";
import { CLAUDE_URL } from "./utilities/endpoints.js";
import { useClickEvent } from "./utilities/events.js";

const genreContainer = document.getElementById("genres");
const seasonContainer = document.getElementById("seasons");
const themeContainer = document.getElementById("interests");
const generateMoviesBtn = document.getElementById("generateMovies");

const apiClientGenres = new ApiClientTmdb(genreContainer, "genres");

let genres = [];
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

  console.log(genres);
  renderGenreBtns();
  renderSeasonBtns();
  renderThemeBtns();
}

function renderGenreBtns() {
  const spinner = document.getElementsByClassName("loader")[0];
  if (spinner) {
    spinner.remove();
  }

  const selectdGenre = (genre) => {
    if (!selectedCategories.genres.includes(genre)) {
      selectedCategories.genres.push(genre);
      console.log("Selcted genres:  ", selectedCategories.genres);
    }
  };

  genreContainer.appendChild(dataListAsBtns(genres, "genreBtns btn-container", "genreBtn btn", selectdGenre));
}

function renderSeasonBtns() {
  const selectSeason = (season) => {
    if (!selectedCategories.seasons.includes(season)) {
      selectedCategories.seasons.push(season);
      console.log("Selected seasons: ", selectedCategories.seasons);
    }
  };

  seasonContainer.appendChild(dataListAsBtns(["Winter", "Spring", "Summer", "Autumn"], "seasonsBtn btn-container", "seasonBtn btn", selectSeason));
}

function renderThemeBtns() {
  const selectTheme = (interest) => {
    if (!selectedCategories.themes.includes(interest)) {
      selectedCategories.themes.push(interest);
      console.log("Selected theme: ", selectedCategories.themes);
    }
  };

  themeContainer.appendChild(dataListAsBtns(["Gaming", "Sports", "Travel", "Food & Cooking", "Fashion", "Technology", "Music", "Art & Design", "History", "Science", "Nature & Wildlife", "Fitness & Health", "Literature", "Photography", "Social Issues", "Psychology", "Adventure Activities", "Pets & Animals", "Mysticism & Spirituality", "Comedy & Humor"], "interestsBtn btn-container", "interestBtn btn", selectTheme));
}

async function generateMovies() {
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
          content: "Suggest 10 action movies",
        },
      ],
    }),
  };

  try {
    const response = await fetch(CLAUDE_URL, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json(); // Use .json() for parsing response
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
