import { redirect, save } from "../utilities/utility.js";
import { MOVIEDETAILS_LSK } from "../utilities/key.js";
import { iconValue } from "../utilities/render.js";
import { useClickEvent } from "../utilities/events.js";

export class MovieCard {
  constructor(movie) {
    this.id = movie.id;
    this.title = movie.title;
    this.rating = movie.rating;
    this.posterSrc = movie.posterSrc || "../../res/images/moviePosterPlaceholder.jpg";
    this.year = movie.year;
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

    useClickEvent(movieCard, () => this.movieDetails(this.title, this.posterSrc, this.id, this.year));

    movieCard.setAttribute("class", "movieCard");
    movieCard.append(poster, ratingIcon);

    return movieCard;
  }

  movieDetails(title, posterSrc, id, year) {
    save(MOVIEDETAILS_LSK, { title, posterSrc, id, year });

    setTimeout(() => {
      redirect("movieDetails.html");
    }, 100);
  }
}
