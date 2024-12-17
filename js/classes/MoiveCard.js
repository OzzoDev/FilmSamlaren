export class MovieCard {
  constructor(movie) {
    this.movie = movie;
  }

  card() {
    const movie = this.movie;
    const title = movie.title;
    const posterSrc = movie.primaryImage;

    const movieCard = document.createElement("div");
    const poster = document.createElement("img");

    poster.setAttribute("src", "../../res/images/moviePosterPlaceholder.jpg");
    poster.setAttribute("class", "poster");
    poster.setAttribute("alt", title);

    const actualPoster = new Image();
    actualPoster.src = posterSrc;
    actualPoster.onload = () => {
      poster.setAttribute("src", posterSrc);
    };

    movieCard.setAttribute("class", "movieCard");
    movieCard.appendChild(poster);

    return movieCard;
  }
}
