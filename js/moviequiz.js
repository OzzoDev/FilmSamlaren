/*Javascript for moviequiz page only*/
import { ApiClientTmdb } from "./classes/ApiClientTmdb.js";
import { dataListAsBtns, renderSpinner } from "./utilities/render.js";
import { CLAUDE_KEY } from "./utilities/apiKey.js";
import { CLAUDE_URL, IMDB_URL } from "./utilities/endpoints.js";
import { useClickEvent } from "./utilities/events.js";
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { MovieCard } from "./classes/MoiveCard.js";

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

  try {
    renderSpinner(moiveContainer);
    const response = await fetch(CLAUDE_URL, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const content = result.choices[0].message.content;

    const movieArray = content
      .split("$")
      .map((movieName) => movieName.replace("$", "").replace("\n", ""))
      .filter((line) => line.trim() !== "");

    if (movieArray) {
      const imdbMovieIDsPromises = movieArray.map((movieName) => {
        const originalTitle = movieName;
        const primaryTitle = movieName;
        const params = `search?originalTitle=${encodeURIComponent(originalTitle)}&primaryTitle=${encodeURIComponent(primaryTitle)}&type=movie`;
        return new ApiClientImdb(moiveContainer, `${IMDB_URL}/${params}`).cachedData();
      });

      const imdbMovieIDs = await Promise.allSettled(imdbMovieIDsPromises);

      const imdbIDs = imdbMovieIDs
        .map((result) => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            return null;
          }
        })
        .filter((result) => result !== null)
        .map((result) => (result.results[0] ? result.results[0].id : null))
        .filter((id) => id !== null);

      const imdbMovieDataPromises = imdbIDs.map((id) => {
        return new ApiClientImdb(moiveContainer, `${IMDB_URL}/${id}`).cachedData();
      });

      const imdbMoiveData = await Promise.allSettled(imdbMovieDataPromises);

      const imdbMovies = imdbMoiveData
        .map((result) => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            return null;
          }
        })
        .filter((result) => result !== null)
        .filter((movie) => {
          const posterSrc = movie.primaryImage;
          const rating = movie.averageRating;
          return posterSrc && typeof posterSrc === "string" && posterSrc.startsWith("http") && rating && rating >= 4;
        });

      selectedCategories.genres = [];
      selectedCategories.seasons = [];
      selectedCategories.themes = [];

      movies = imdbMovies;

      renderGenreBtns();
      renderSeasonBtns();
      renderThemeBtns();
      renderMovies();
    }
  } catch (error) {
    console.error(error);
  }
}

function renderGenreBtns() {
  genreContainer.innerHTML = "";

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
  seasonContainer.innerHTML = "";

  const selectSeason = (season) => {
    if (!selectedCategories.seasons.includes(season)) {
      selectedCategories.seasons.push(season);
    }
  };

  seasonContainer.appendChild(dataListAsBtns(["Winter", "Spring", "Summer", "Autumn"], "seasonsBtn btn-container", "seasonBtn btn", selectSeason));
}

function renderThemeBtns() {
  themeContainer.innerHTML = "";

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
