export class MovieCard {
  constructor(movie) {
    this.moive = movie;
  }

  card() {
    const movie = this.moive;
    const moviePoster = movie.primaryImage;

    const container = document.createElement("div");

    container.setAttribute("class", "moiveCard");

    container.style.backgroundImage = `url(${moviePoster})`;

    return container;
  }
}
