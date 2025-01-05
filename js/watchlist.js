/*Javascript for watchlist page only*/
import { load, save } from "./utilities/utility.js";
import { WATCHLIST_LSK } from "./utilities/key.js";
import { MovieCard } from "./classes/MoiveCard.js";
import { iconBtn } from "./utilities/render.js";
import { ApiClientTmdb } from "./classes/ApiClientTmdb.js";
import { TMDB_KEY } from "./utilities/apiKey.js";

const main = document.body.getElementsByTagName("main")[0];
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
  const moviePromises = [...watchlist].map((watch) => {
    const params = `movie/${watch.id}?api_key=${TMDB_KEY}`;
    return new ApiClientTmdb(watchlistEl).cachedData(params);
  });

  movies = await Promise.all(moviePromises);

  renderPageMessage();
  renderWatchList();
}

function renderPageMessage() {
  const prevPageMessage = document.getElementsByClassName("pageMessage")[0];
  if (prevPageMessage) {
    prevPageMessage.remove();
  }

  const pageMessage = document.createElement("h1");

  if (movies.length > 0) {
    pageMessage.setAttribute("class", "pageMessage numMovies");
    pageMessage.innerText = "Your watchlist is loking hot🔥";
    pageMessage.setAttribute("data-movies", movies.length);
  } else {
    pageMessage.setAttribute("class", "pageMessage");
    pageMessage.innerText = "Your watchlist is empty 🎥";
  }

  main.insertBefore(pageMessage, watchlistEl);
}

function renderWatchList() {
  watchlistEl.innerHTML = "";
  if (movies) {
    movies.forEach((movie) => {
      const title = movie.primaryTitle;
      const id = movie.id;
      const date = watchlist.find((watch) => watch.id === id).addedAt || "";

      const removeMovie = () => {
        watchlist = watchlist.filter((watch) => watch.id !== id);
        save(WATCHLIST_LSK, watchlist);
        loadWatchList();
      };

      const watchEl = document.createElement("li");
      const controlsEl = document.createElement("div");
      const dateEl = document.createElement("p");
      const removeBtn = iconBtn("trash", `Remove ${title} from watchlist`, removeMovie);
      const movieCard = new MovieCard(movie).card();

      watchEl.setAttribute("class", "watch");
      controlsEl.setAttribute("class", "controls");
      dateEl.setAttribute("class", "date");
      removeBtn.classList.add("removeBtn");

      dateEl.innerText = date;

      controlsEl.append(removeBtn, dateEl);
      watchEl.append(controlsEl, movieCard);
      watchlistEl.appendChild(watchEl);
    });
  }
}
