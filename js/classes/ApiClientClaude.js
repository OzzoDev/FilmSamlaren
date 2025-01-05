import { CLAUDE_KEY, TMDB_KEY } from "../utilities/apiKey.js";
import { CLAUDE_URL } from "../utilities/endpoints.js";
import { MOVIESUGGESTIONS_LSK } from "../utilities/key.js";
import { MOVIESUGGESTIONS_TTL } from "../utilities/ttl.js";
import { renderErrorMessage, renderSpinner } from "../utilities/render.js";
import { cacheData, filterUniqueTitles, useCachedData } from "../utilities/utility.js";
import { ApiClientTmdb } from "./ApiClientTmdb.js";

export class ApiClientClaude {
  constructor(actionContainer) {
    this.actionContainer = actionContainer;
  }

  async generateMovies(params) {
    let prompt;
    const randomSuffix = new Date().getTime();
    let previousMovies = useCachedData(MOVIESUGGESTIONS_LSK) || [];

    if (params) {
      prompt = `Suggest 10 movies that match these genres: ${params}. Only suggest movies with high ratings that are well known, with high revenue. Put a dollar symbol before each suggestion. It is okay if the movies don't perfectly align with the requirements; just suggest 10 movies as close as possible to the requirements. Only include the movie name in the response. Previous suggestions: ${previousMovies.join(", ")}. Request ID: ${randomSuffix}`;
    } else {
      prompt = `Suggest a fresh set of totally random movies, ensuring no repeats from previous responses. Only suggest movies with high ratings that are well known, with high revenue. Put a dollar symbol before each suggestion. It is okay if the movies don't perfectly align with the requirements; just suggest 10 movies as close as possible to the requirements. Only include the movie name in the response. Previous suggestions: ${previousMovies.join(", ")}. Request ID: ${randomSuffix}`;
    }

    const options = {
      method: "POST",
      url: CLAUDE_URL,
      headers: {
        "x-rapidapi-key": CLAUDE_KEY,
        "x-rapidapi-host": "claude-3-haiku-ai.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        model: "claude-3-haiku-20240307",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    };

    let content;

    try {
      renderSpinner(this.actionContainer);

      const response = await axios(options);

      content = response.data.choices[0].message.content;

      const movieArray =
        content
          .split("$")
          .map((movieName) => movieName.replace("$", "").replace("\n", ""))
          .filter((line) => line.trim() !== "") || [];

      const tmdbMoviePromises = movieArray.map((movieName) => {
        const params = `search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(movieName)}`;
        return new ApiClientTmdb(this.actionContainer).cachedData(params);
      });

      const data = await Promise.all(tmdbMoviePromises);
      const movies = filterUniqueTitles(data.map((dataItem) => dataItem.results[0]).filter((movie) => movie && movie.poster_path && movie.vote_average > 6));
      previousMovies = [...new Set([...previousMovies, ...movies.map((movie) => movie.original_title)])];

      cacheData(MOVIESUGGESTIONS_LSK, previousMovies, MOVIESUGGESTIONS_TTL);

      return movies;
    } catch (error) {
      console.log(error);

      renderErrorMessage(this.actionContainer, "500 Internal Server Error: The server encountered a situation it doesn’t know how to handle.");
    }
  }
}
