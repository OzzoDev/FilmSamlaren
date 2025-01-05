/*Main ApiClient to fetch data*/
import { IMDB_KEY } from "../utilities/apiKey.js";
import { IMDB_ENDPOINTS } from "../utilities/endpoints.js";
import { BASE_TTL } from "../utilities/ttl.js";
import { cacheData, useCachedData, inSensitive } from "../utilities/utility.js";
import { renderSpinner, renderErrorMessage } from "../utilities/render.js";

export class ApiClientImdb {
  constructor(actionContainer, endpoint, params, key) {
    this.actionContainer = actionContainer;
    this.endpoint = inSensitive(endpoint);
    this.params = params;
    this.key = inSensitive(key || endpoint);
  }

  async fetchData(cache) {
    const actionContainer = this.actionContainer;
    const endpoint = this.endpoint;
    const key = this.key;
    const params = this.params;

    let url;

    if (endpoint in IMDB_ENDPOINTS) {
      if (params) {
        url = `${IMDB_ENDPOINTS[endpoint]}${params}`;
      } else {
        url = IMDB_ENDPOINTS[endpoint];
      }
    } else {
      url = endpoint;
    }

    if (url) {
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": IMDB_KEY,
          "x-rapidapi-host": "imdb236.p.rapidapi.com",
        },
      };

      renderSpinner(actionContainer);

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          const statusCode = response.status;

          switch (statusCode) {
            case 400:
              renderErrorMessage(actionContainer, "400 Bad Request: The server could not understand the request due to invalid syntax.");
              break;
            case 401:
              renderErrorMessage(actionContainer, "401 Unauthorized: Authentication is required and has failed or has not yet been provided.");
              break;
            case 402:
              renderErrorMessage(actionContainer, "402 Payment Required: This response code is reserved for future use.");
              break;
            case 403:
              renderErrorMessage(actionContainer, "403 Forbidden: The server understood the request, but it refuses to authorize it.");
              break;
            case 404:
              renderErrorMessage(actionContainer, "404 Not Found: The requested resource could not be found on the server.");
              break;
            case 405:
              renderErrorMessage(actionContainer, "405 Method Not Allowed: The request method is known by the server but is not supported by the target resource.");
              break;
            case 406:
              renderErrorMessage(actionContainer, "406 Not Acceptable: The server cannot produce a response matching the list of acceptable values defined in the request headers.");
              break;
            case 407:
              renderErrorMessage(actionContainer, "407 Proxy Authentication Required: The client must first authenticate itself with the proxy.");
              break;
            case 408:
              renderErrorMessage(actionContainer, "408 Request Timeout: The server timed out waiting for the request.");
              break;
            case 409:
              renderErrorMessage(actionContainer, "409 Conflict: The request could not be completed due to a conflict with the current state of the resource.");
              break;
            case 429:
              renderErrorMessage(actionContainer, "429 Too many request: You have exceeded the quota for the maxium number of api calls today.");
              break;
            case 500:
              renderErrorMessage(actionContainer, "500 Internal Server Error: The server encountered a situation it doesn’t know how to handle.");
              break;
            case 501:
              renderErrorMessage(actionContainer, "501 Not Implemented: The request method is not supported by the server and cannot be handled.");
              break;
            case 502:
              renderErrorMessage(actionContainer, "502 Bad Gateway: The server was acting as a gateway and received an invalid response from the upstream server.");
              break;
            case 503:
              renderErrorMessage(actionContainer, "503 Service Unavailable: The server is not ready to handle the request, often due to maintenance.");
              break;
            case 504:
              renderErrorMessage(actionContainer, "504 Gateway Timeout: The server was acting as a gateway and did not receive a timely response from the upstream server.");
              break;
            case 505:
              renderErrorMessage(actionContainer, "505 HTTP Version Not Supported: The server does not support the HTTP protocol version that was used in the request.");
              break;
            case 511:
              renderErrorMessage(actionContainer, "511 Network Authentication Required: The client needs to authenticate to gain network access.");
              break;
            default:
              renderErrorMessage(actionContainer, `Unexpected error: ${statusCode} - Please check the request and try again.`);
              break;
          }
          return [];
        }

        const res = await response.json();

        if (cache) {
          cacheData(key, res, BASE_TTL);
        }

        return res;
      } catch (error) {
        console.error(error);
        return [];
      }
    }
    return [];
  }

  async cachedData() {
    const key = this.key;

    const loadedData = useCachedData(key);

    if (loadedData) {
      return loadedData;
    }
    const fetchedData = this.fetchData(true);
    return fetchedData;
  }

  async losseData() {
    const key = this.key;

    const loadedData = useCachedData(key);

    if (loadedData) {
      return loadedData;
    }
    const fetchedData = this.fetchData(false);
    return fetchedData;
  }
}
