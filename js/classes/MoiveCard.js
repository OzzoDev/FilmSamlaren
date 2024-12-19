import { iconValue } from "../utilities/render.js";
import { isValidImage } from "../utilities/utility.js";

export class MovieCard {
  constructor(movie) {
    this.movie = movie;
  }

  card() {
    const movie = this.movie;

    const title = movie.title || movie.primaryTitle;
    const rating = movie.averageRating || 0;
    const posterSrc = movie.primaryImage || "../../res/images/moviePosterPlaceholder.jpg";

    const movieCard = document.createElement("div");
    const poster = document.createElement("img");
    const ratingIcon = iconValue(rating, "ribbon", `${title} has an rating of ${rating}`, "right");

    poster.setAttribute("src", "../../res/images/moviePosterPlaceholder.jpg");
    poster.setAttribute("class", "poster");
    poster.setAttribute("alt", title);

    const actualPoster = new Image();

    if (posterSrc && typeof posterSrc === "string" && posterSrc.startsWith("http")) {
      actualPoster.src = posterSrc;
      actualPoster.onload = () => {
        poster.setAttribute("src", posterSrc);
      };
    } else {
      actualPoster.src = "../../res/images/moviePosterPlaceholder.jpg";
    }

    movieCard.setAttribute("class", "movieCard");
    movieCard.append(poster, ratingIcon);

    return movieCard;
  }
}
