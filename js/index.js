/*Javascript for index/start page only*/
import { ApiClientImdb } from "./classes/ApiClientImdb.js";

const apiClientTopMovies = new ApiClientImdb("topMovies");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
}

async function getData() {
  const topMovies = await apiClientTopMovies.cachedData();

  console.log(topMovies);
}
