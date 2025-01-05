/*Js for movieDetails page*/
import { ApiClientTmdb } from "./classes/ApiClientTmdb.js";
import { TMDB_KEY } from "./utilities/apiKey.js";
import { load, save, formatMinutes, formatDate } from "./utilities/utility.js";
import { MOVIEDETAILS_LSK, WATCHLIST_LSK } from "./utilities/key.js";
import { iconValue, populateUl } from "./utilities/render.js";
import { useClickEvent } from "./utilities/events.js";

const movieDetailsEl = document.getElementById("movieDetails");

let watchlist = load(WATCHLIST_LSK) || [];
let isTracked;
let movie;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadMovieDetails();
}

async function loadMovieDetails() {
  const selectedMovie = load(MOVIEDETAILS_LSK);

  if (selectedMovie) {
    const params = `movie/${selectedMovie}?api_key=${TMDB_KEY}`;
    movie = await new ApiClientTmdb(movieDetailsEl).cachedData(params);
    isTracked = watchlist.map((watch) => watch.id).includes(movie.id);

    console.log("Movies Details from tmdb: ", movie);

    if (!movie) {
      renderNoDetails(selectedMovie.title);
    } else {
      renderMovieDetails();
    }
  }
}

function renderMovieDetails() {
  movieDetailsEl.innerHTML = "";

  const id = movie.id;
  const title = movie.original_title;
  const posterSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const rating = movie.vote_average.toFixed(1);
  const duration = formatMinutes(movie.runtime);
  const date = movie.release_date;
  const popularity = movie.popularity;
  const votes = movie.vote_count;
  const country = movie.origin_country[0];
  const language = movie.original_language;
  const genres = movie.genres.map((genre) => genre.name);
  const desc = movie.overview;

  const posterEl = document.createElement("img");
  const movieDataEl = document.createElement("div");
  const headingEl = document.createElement("div");
  const titleEl = document.createElement("h1");
  const ratingIconEl = iconValue(rating, "ribbon", `${title} has an rating of ${rating}`, "right");
  const durationEl = document.createElement("p");
  const dateEl = document.createElement("p");
  const popularityEl = document.createElement("p");
  const votesEl = document.createElement("p");
  const countryEl = document.createElement("p");
  const languageEL = document.createElement("p");
  const genresEl = document.createElement("ul");
  const descEl = document.createElement("p");
  const watchListBtn = document.createElement("button");

  posterEl.setAttribute("class", "poster");
  movieDataEl.setAttribute("class", "movieData");
  headingEl.setAttribute("class", "movieHeader");
  titleEl.setAttribute("class", "title");
  ratingIconEl.classList.add("rating");
  durationEl.setAttribute("class", "duration movieStat");
  dateEl.setAttribute("class", "date movieStat");
  popularityEl.setAttribute("class", "popularity movieStat");
  votesEl.setAttribute("class", "votes movieStat");
  countryEl.setAttribute("class", "country movieStat");
  languageEL.setAttribute("class", "language movieStat");
  genresEl.setAttribute("class", "genres");
  descEl.setAttribute("class", "desc");
  watchListBtn.setAttribute("class", "watchList btn");

  posterEl.setAttribute("class", "poster");
  posterEl.setAttribute("src", posterSrc);
  posterEl.setAttribute("alt", title);

  titleEl.innerText = title;
  durationEl.innerText = duration;
  dateEl.innerText = date;
  popularityEl.innerText = `Popularity: ${popularity}`;
  votesEl.innerText = `Votes: ${votes}`;
  descEl.innerText = desc;
  countryEl.innerHTML = `Country: ${country}`;
  languageEL.innerHTML = `Language: ${language}`;
  watchListBtn.innerText = isTracked ? "Remove from watchlist" : "Add to watchlist";

  populateUl(genresEl, genres, "genre");

  const toggleMovieInWatchList = () => {
    isTracked = [...watchlist].map((watch) => watch.id).includes(movie.id);

    if (isTracked) {
      watchlist = watchlist.filter((movie) => movie.id !== id);
      watchListBtn.innerText = "Add to watchlist";
    } else {
      watchlist = [...watchlist, { id, addedAt: formatDate(new Date()) }];
      watchListBtn.innerText = "Remove from watchlist";
    }

    save(WATCHLIST_LSK, watchlist);
  };

  useClickEvent(watchListBtn, toggleMovieInWatchList);

  headingEl.append(titleEl, ratingIconEl);
  movieDataEl.append(headingEl, durationEl, dateEl, popularityEl, votesEl, countryEl, languageEL, genresEl, descEl, watchListBtn);
  movieDetailsEl.append(posterEl, movieDataEl);
}

function renderNoDetails(title) {
  movieDetailsEl.innerHTML = "";
  const messageEl = document.createElement("h1");
  messageEl.setAttribute("class", "error");
  messageEl.innerText = `No details found for ${title}`;
  movieDetailsEl.appendChild(messageEl);
}
