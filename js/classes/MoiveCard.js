import { redirect, save } from "../utilities/utility.js";
import { MOVIEDETAILS_LSK } from "../utilities/key.js";
import { iconValue } from "../utilities/render.js";
import { useClickEvent } from "../utilities/events.js";

export class MovieCard {
  constructor(movie) {
    this.id = movie.id;
    this.title = movie.original_title;
    this.rating = movie.vote_average.toFixed(1);
    this.posterSrc = `https://image.tmdb.org/t/p/w500${movie.poster_path}` || "../../res/images/moviePosterPlaceholder.jpg";
    this.year = parseInt(movie.release_date);
  }

  card() {
    const movieCard = document.createElement("div");
    const poster = document.createElement("img");
    const ratingIcon = iconValue(this.rating, "ribbon", `${this.title} has an imdb rating of ${this.rating}`, "right");

    poster.setAttribute("src", "../../res/images/moviePosterPlaceholder.jpg");
    poster.setAttribute("class", "poster");
    poster.setAttribute("alt", this.title);

    const actualPoster = new Image();

    if (this.posterSrc && typeof this.posterSrc === "string" && this.posterSrc.startsWith("http")) {
      actualPoster.src = this.posterSrc;
      actualPoster.onload = () => {
        poster.setAttribute("src", this.posterSrc);
      };
    } else {
      actualPoster.src = "../../res/images/moviePosterPlaceholder.jpg";
    }

    useClickEvent(movieCard, () => this.movieDetails(this.id));

    movieCard.setAttribute("class", "movieCard");
    movieCard.append(poster, ratingIcon);

    return movieCard;
  }

  movieDetails(id) {
    save(MOVIEDETAILS_LSK, id);
    setTimeout(() => {
      redirect("movieDetails.html");
    }, 100);
  }
}
