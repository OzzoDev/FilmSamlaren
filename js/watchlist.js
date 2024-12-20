/*Javascript for watchlist page only*/
import { load, save } from "./utilities/utility.js";
import { MOVIEDETAILS_LSK, WATCHLIST_LSK } from "./utilities/key.js";
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { IMDB_URL } from "./utilities/endpoints.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { iconBtn, iconValue, populateUl, ulWithHeader, valueWithHeader, iconLink, setIcon } from "./utilities/render.js";
import { useClickEvent } from "./utilities/events.js";

const watchlistEl = document.getElementById("watchlist");

let watchlist = load(WATCHLIST_LSK) || [];
let movies;

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  loadWatchList();
}

async function loadWatchList() {
  const moviePromises = [...watchlist].map((id) => {
    return new ApiClientImdb(watchlist, `${IMDB_URL}/${id}`).cachedData();
  });

  const movieData = await Promise.allSettled(moviePromises);

  movies = movieData
    .map((result) => {
      if ((result.status = "fulfilled")) {
        return result.value;
      } else {
        return null;
      }
    })
    .filter((movie) => movie !== null);

  renderWatchList();
}

function renderWatchList() {
  watchlistEl.innerHTML = "";
  if (movies) {
    movies.forEach((moive) => {
      const movieCard = new MovieCard(moive).card();
      watchlistEl.appendChild(movieCard);
    });
  }
}
