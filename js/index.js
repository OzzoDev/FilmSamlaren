/*Javascript for index/start page only*/
import { ApiClientImdb } from "./classes/ApiClientImdb.js";

const apiClientTopMovies = new ApiClientImdb(document.body, "topMovies");

window.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  getData();
}

async function getData() {
  const topMovies = await apiClientTopMovies.fetchData();

  document.body.innerHTML = "";

  console.log(topMovies);
}
