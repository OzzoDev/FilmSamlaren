/*Js for movieDetails page*/
import { load, formatMinutes } from "./utilities/utility.js";
import { MOVIEDETAILS_LSK } from "./utilities/key.js";
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { IMDB_URL } from "./utilities/endpoints.js";
import { iconBtn, iconValue } from "./utilities/render.js";

const movieDetailsEl = document.getElementById("movieDetails");

let movie;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getMovieDetails();
}

async function getMovieDetails() {
  const selectedMovie = load(MOVIEDETAILS_LSK);

  if (selectedMovie) {
    console.log("MovieID: ", selectedMovie);
    const movieDetails = await new ApiClientImdb(movieDetailsEl, `${IMDB_URL}/${selectedMovie}`).cachedData();

    movie = movieDetails;

    console.log("Movie details: ", movieDetails);

    renderMovieDetails();
  }
}

function renderMovieDetails() {
  renderHeading(movieDetailsEl);
  renderYearDuration(movieDetailsEl);
  renderPoster(movieDetailsEl);
}

function renderHeading(parent) {
  const title = movie.primaryTitle;
  const rating = movie.averageRating;

  const headingEl = document.createElement("div");
  const addToWatchListEl = iconBtn("plus", `Add ${title} to watchlist`);
  const titleEl = document.createElement("h1");
  const ratingIconEl = iconValue(rating, "ribbon", `${title} has an rating of ${rating}`, "right");

  headingEl.setAttribute("class", "heading");
  addToWatchListEl.classList.add("addToWatchList");
  titleEl.setAttribute("class", "title");
  ratingIconEl.classList.add("rating");

  titleEl.innerText = title;

  headingEl.append(addToWatchListEl, titleEl, ratingIconEl);

  parent.appendChild(headingEl);
}

function renderYearDuration(parent) {
  const year = movie.startYear;
  const duration = formatMinutes(movie.runtimeMinutes);

  const yearDurationEl = document.createElement("div");
  const yearEl = document.createElement("p");
  const durationEl = document.createElement("p");

  yearDurationEl.setAttribute("class", "yearDuration");
  yearEl.setAttribute("class", "year");
  durationEl.setAttribute("class", "duration");

  yearEl.innerText = year;
  durationEl.innerText = duration;

  yearDurationEl.append(yearEl, durationEl);

  parent.appendChild(yearDurationEl);
}

function renderPoster(parent) {
  const posterSrc = movie.primaryImage;
  const title = movie.primaryTitle;

  const posterEl = document.createElement("img");

  posterEl.setAttribute("class", "poster");
  posterEl.setAttribute("src", "../../res/images/moviePosterPlaceholder.jpg");
  posterEl.setAttribute("alt", title);

  const loadingPoster = new Image();

  if (posterSrc && typeof posterSrc === "string" && posterSrc.startsWith("http")) {
    loadingPoster.setAttribute("src", posterSrc);
    loadingPoster.onload = () => {
      posterEl.setAttribute("src", posterSrc);
    };
  } else {
    loadingPoster.setAttribute("class", posterSrc);
  }

  parent.appendChild(posterEl);
}
