/*Main ApiClient to fetch data*/
import { IMDB_KEY } from "../utilities/apiKey.js";
import { IMDB_ENDPOINTS } from "../utilities/endpoints.js";
import { BASE_TTL } from "../utilities/ttl.js";
import { cacheData, useCachedData } from "../utilities/utility.js";
import { renderErrorMessage } from "../utilities/render.js";

export class ApiClientImdb {
  constructor(endpoint, errorContainer) {
    this.endpoint = endpoint;
    this.errorContainer = errorContainer;
  }

  async fetchData() {
    const endpoint = this.endpoint;
    const key = this.endpoint;

    const url = IMDB_ENDPOINTS[endpoint];

    if (url) {
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": IMDB_KEY,
          "x-rapidapi-host": "imdb236.p.rapidapi.com",
        },
      };
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          const statusCode = response.status;

          const errorContainer = this.errorContainer;

          switch (statusCode) {
            case 400:
              renderErrorMessage(errorContainer, "400 Bad Request: The server could not understand the request due to invalid syntax.");
              break;
            case 401:
              renderErrorMessage(errorContainer, "401 Unauthorized: Authentication is required and has failed or has not yet been provided.");
              break;
            case 402:
              renderErrorMessage(errorContainer, "402 Payment Required: This response code is reserved for future use.");
              break;
            case 403:
              renderErrorMessage(errorContainer, "403 Forbidden: The server understood the request, but it refuses to authorize it.");
              break;
            case 404:
              renderErrorMessage(errorContainer, "404 Not Found: The requested resource could not be found on the server.");
              break;
            case 405:
              renderErrorMessage(errorContainer, "405 Method Not Allowed: The request method is known by the server but is not supported by the target resource.");
              break;
            case 406:
              renderErrorMessage(errorContainer, "406 Not Acceptable: The server cannot produce a response matching the list of acceptable values defined in the request headers.");
              break;
            case 407:
              renderErrorMessage(errorContainer, "407 Proxy Authentication Required: The client must first authenticate itself with the proxy.");
              break;
            case 408:
              renderErrorMessage(errorContainer, "408 Request Timeout: The server timed out waiting for the request.");
              break;
            case 409:
              renderErrorMessage(errorContainer, "409 Conflict: The request could not be completed due to a conflict with the current state of the resource.");
              break;
            case 500:
              renderErrorMessage(errorContainer, "500 Internal Server Error: The server encountered a situation it doesn’t know how to handle.");
              break;
            case 501:
              renderErrorMessage(errorContainer, "501 Not Implemented: The request method is not supported by the server and cannot be handled.");
              break;
            case 502:
              renderErrorMessage(errorContainer, "502 Bad Gateway: The server was acting as a gateway and received an invalid response from the upstream server.");
              break;
            case 503:
              renderErrorMessage(errorContainer, "503 Service Unavailable: The server is not ready to handle the request, often due to maintenance.");
              break;
            case 504:
              renderErrorMessage(errorContainer, "504 Gateway Timeout: The server was acting as a gateway and did not receive a timely response from the upstream server.");
              break;
            case 505:
              renderErrorMessage(errorContainer, "505 HTTP Version Not Supported: The server does not support the HTTP protocol version that was used in the request.");
              break;
            case 511:
              renderErrorMessage(errorContainer, "511 Network Authentication Required: The client needs to authenticate to gain network access.");
              break;
            default:
              renderErrorMessage(errorContainer, `Unexpected error: ${statusCode} - Please check the request and try again.`);
              break;
          }
          return [];
        }

        const res = await response.json();

        cacheData(key, res, BASE_TTL);

        return res;
      } catch (error) {
        console.error(error);
      }
    }
  }

  async cachedData() {
    const key = this.endpoint;

    const loadedData = useCachedData(key);

    if (loadedData) {
      console.log("Servering cached data for", key);
      return loadedData;
    }
    console.log("Servering fetched data for", key);
    const fetchedData = this.fetchData();
    return fetchedData;
  }
}
