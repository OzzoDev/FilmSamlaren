/*Js for movieDetails page*/
import { load } from "./utilities/utility.js";
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

    renderHeading(movieDetailsEl);
  }
}

function renderHeading(parent) {
  const title = movie.primaryTitle;
  const rating = movie.averageRating;

  const headingEl = document.createElement("div");
  const addToWatchListEl = iconBtn("plus", `Add ${title} to watchlist`);
  const titleEl = document.createElement("h2");
  const ratingIconEl = iconValue(rating, "ribbon", `${title} has an rating of ${rating}`, "right");

  headingEl.setAttribute("class", "heading");
  addToWatchListEl.classList.add("addToWatchList");
  titleEl.setAttribute("class", "title");
  ratingIconEl.classList.add("rating");

  titleEl.innerText = title;

  headingEl.append(addToWatchListEl, titleEl, ratingIconEl);

  parent.appendChild(headingEl);
}
