/*Js for movieDetails page*/
import { load, formatMinutes, formatLargeNumber } from "./utilities/utility.js";
import { MOVIEDETAILS_LSK } from "./utilities/key.js";
import { ApiClientImdb } from "./classes/ApiClientImdb.js";
import { IMDB_URL } from "./utilities/endpoints.js";
import { iconBtn, iconValue, populateUl, ulWithHeader, valueWithHeader, iconLink } from "./utilities/render.js";

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
  renderHeading();
  renderYearDuration();
  renderPoster();
  renderCinematicAtlas();
  renderDesc();
  renderLanguages();
  renderCinematicTeam();
  renderFinancials();
  renderExternalLinks();
}

function renderHeading() {
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

  movieDetailsEl.appendChild(headingEl);
}

function renderYearDuration() {
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

  movieDetailsEl.appendChild(yearDurationEl);
}

function renderPoster() {
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

  movieDetailsEl.appendChild(posterEl);
}

function renderCinematicAtlas() {
  const countries = movie.countriesOfOrigin || [];
  const locations = movie.filmingLocations || [];
  const genres = movie.genres || [];
  const interests = movie.interests || [];

  const cinematicAtlasEl = document.createElement("div");
  const countriesEl = document.createElement("ul");
  const locationsEl = document.createElement("ul");
  const genresEl = document.createElement("ul");
  const interestsEl = document.createElement("ul");

  cinematicAtlasEl.setAttribute("class", "cinematicAtlas");
  countriesEl.setAttribute("class", "countries dataList");
  locationsEl.setAttribute("class", "locations dataList");
  genresEl.setAttribute("class", "genres dataList dataListRight");
  interestsEl.setAttribute("class", "interests dataList dataListRight");

  countriesEl.setAttribute("data-title", "Countries");
  locationsEl.setAttribute("data-title", "Locations");
  genresEl.setAttribute("data-title", "Genres");
  interestsEl.setAttribute("data-title", "Interests");

  populateUl(countriesEl, countries, "country dataItem");
  populateUl(locationsEl, locations, "location dataItem");
  populateUl(genresEl, genres, "genres dataItem");
  populateUl(interestsEl, interests, "interests dataItem");

  cinematicAtlasEl.append(countriesEl, genresEl, locationsEl, interestsEl);

  movieDetailsEl.appendChild(cinematicAtlasEl);
}

function renderDesc() {
  const desc = movie.description;
  const descEl = document.createElement("p");

  descEl.setAttribute("class", "desc");
  descEl.innerText = desc;

  movieDetailsEl.appendChild(descEl);
}

function renderLanguages() {
  const languages = movie.spokenLanguages;
  const languagesEl = document.createElement("ul");

  languagesEl.setAttribute("class", "languages");

  populateUl(languagesEl, languages, "language");

  movieDetailsEl.appendChild(languagesEl);
}

function renderCinematicTeam() {
  const directors = movie.directors.map((director) => director.fullName) || [];
  const writers = movie.writers.map((writer) => writer.fullName) || [];
  const cast = movie.cast || [];

  const cinematicTeamEl = document.createElement("div");
  const directorsWritersEl = document.createElement("div");
  const castEl = document.createElement("ul");
  const castLabelEl = document.createElement("h3");
  const direcotrsEl = ulWithHeader(directors, "Directors", "directors", "directorsHeader", "directorsList", "director");
  const writersEl = ulWithHeader(writers, "Writers", "writers", "writersHeader", "writersList", "writer");

  cinematicTeamEl.setAttribute("class", "cinematicTeam");
  directorsWritersEl.setAttribute("class", "directorsWriters");
  castLabelEl.setAttribute("class", "castLabel");
  castEl.setAttribute("class", "cast");

  castLabelEl.innerText = "Cast";

  cast.forEach((contributor) => {
    const contributorName = contributor.fullName;
    const contributorJob = contributor.job.replace("_", " ") || "";
    const contributorCharacters = contributor.characters || [];

    const contributorItemEl = document.createElement("li");
    const contributorNameEl = document.createElement("h3");
    const contributorJobEl = document.createElement("h4");
    const contributorCharactersLabelEl = document.createElement("p");
    const contributorCharactersEl = document.createElement("ul");

    contributorItemEl.setAttribute("class", "contributor");
    contributorNameEl.setAttribute("class", "contributorName");
    contributorJobEl.setAttribute("class", "contributorJob");
    contributorCharactersLabelEl.setAttribute("class", "contributorCharactersLabel");
    contributorCharactersEl.setAttribute("class", "contributorCharacters");

    contributorNameEl.innerText = contributorName;
    contributorJobEl.innerText = contributorJob;
    contributorCharactersLabelEl.innerText = "Characters";

    contributorCharacters.forEach((character) => {
      const characterItemEl = document.createElement("li");
      characterItemEl.setAttribute("class", "character");
      characterItemEl.innerText = character;
      contributorCharactersEl.appendChild(characterItemEl);
    });

    contributorItemEl.appendChild(contributorNameEl);
    contributorItemEl.appendChild(contributorJobEl);
    if (contributorCharacters.length > 0) {
      contributorItemEl.appendChild(contributorCharactersLabelEl);
    }
    contributorItemEl.appendChild(contributorCharactersEl);

    castEl.appendChild(contributorItemEl);
  });

  directorsWritersEl.append(direcotrsEl, writersEl);
  cinematicTeamEl.append(directorsWritersEl, castLabelEl, castEl);

  movieDetailsEl.appendChild(cinematicTeamEl);
}

function renderFinancials() {
  const budget = formatLargeNumber(movie.budget || "");
  const revenue = formatLargeNumber(movie.grossWorldwide || "");

  const financialsEl = document.createElement("div");
  const budgetEl = valueWithHeader(budget, "Budget", "budget", "budgetHeader", "budgetText");
  const revenueEl = valueWithHeader(revenue, "Revenue", "revenue", "revenueHeader", "revenueText");

  financialsEl.setAttribute("class", "financials");

  financialsEl.append(budgetEl, revenueEl);

  movieDetailsEl.appendChild(financialsEl);
}

function renderExternalLinks() {
  const title = movie.primaryTitle;
  const links = movie.externalLinks || [];
  const linksEl = document.createElement("ul");

  const socials = ["instagram", "facebook", "twitter", "tiktok"];

  linksEl.setAttribute("class", "links");

  links.forEach((link) => {
    const iconPath = socials.find((social) => link.includes(social)) || "internet";
    const linkEl = iconLink(link, iconPath, `Visit ${title}'s ${iconPath}`, "link");
    linksEl.appendChild(linkEl);
  });

  movieDetailsEl.appendChild(linksEl);
}
