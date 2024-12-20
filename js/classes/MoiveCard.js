import { redirect, save } from "../utilities/utility.js";
import { MOVIEDETAILS_LSK } from "../utilities/key.js";
import { iconValue } from "../utilities/render.js";

export class MovieCard {
  constructor(movie) {
    this.movie = movie;
  }

  card() {
    const movie = this.movie;

    const id = movie.id;
    const title = movie.title || movie.primaryTitle;
    const rating = movie.averageRating || 0;
    const posterSrc = movie.primaryImage || movie.Poster || "../../res/images/moviePosterPlaceholder.jpg";

    const movieCard = document.createElement("div");
    const poster = document.createElement("img");
    const ratingIcon = iconValue(rating, "ribbon", `${title} has an imdb rating of ${rating}`, "right");

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

    movieCard.addEventListener("click", () => {
      this.movieDetails(id);
    });

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
