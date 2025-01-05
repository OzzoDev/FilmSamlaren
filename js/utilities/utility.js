/*Common utilities functions for all pages*/
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
  const loaded = JSON.parse(localStorage.getItem(key));

  if (loaded === null) {
    return null;
  }

  const keys = Object.keys(loaded);

  const hasSavedAtProp = keys.includes("savedAt");
  const hasTtlProp = keys.includes("ttl");

  if (hasSavedAtProp && hasTtlProp) {
    const currentDate = new Date();
    const savedAt = loaded.savedAt;
    const ttl = loaded.ttl;

    const dataIsLiving = !compareWithTempDate(currentDate, savedAt, ttl);

    if (dataIsLiving) {
      return loaded;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  }

  return loaded;
}

export function remove(key) {
  localStorage.removeItem(key);
}

export function cacheData(key, data, ttl) {
  const cacheItem = {
    savedAt: new Date(),
    ttl: ttl,
    data: data,
  };

  save(key, cacheItem);
}

export function useCachedData(key) {
  const loaded = load(key);

  if (loaded) {
    const currentDate = new Date();
    const savedAt = loaded.savedAt;
    const ttl = loaded.ttl;

    const dataIsLiving = !compareWithTempDate(currentDate, savedAt, ttl);

    if (dataIsLiving) {
      const data = loaded.data;
      return data;
    } else {
      return null;
    }
  }
}

export function compareWithTempDate(date1, date2, timeLimitInSeconds) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d2.setSeconds(d2.getSeconds() + timeLimitInSeconds);

  return d1 > d2;
}

export function formatLargeNumber(num) {
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  return num;
}

export function normalSort(arr, key) {
  return [...arr].sort((a, b) => {
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]);
    } else {
      return a[key] - b[key];
    }
  });
}

export function reverseSort(arr, key) {
  return [...arr].sort((a, b) => {
    if (typeof a[key] === "string") {
      return b[key].localeCompare(a[key]);
    } else {
      return b[key] - a[key];
    }
  });
}

export function sortAz(arr) {
  return (arr = [...arr].sort((a, b) => {
    return a.localeCompare(b);
  }));
}

export function removeAllWhitespaces(str) {
  return str.replace(/\s+/g, "");
}

export function lowercaseFirstChar(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function inSensitive(str) {
  return removeAllWhitespaces(lowercaseFirstChar(str));
}

export function isValidImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export function formatMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}h `;
  }
  if (remainingMinutes > 0) {
    formatted += `${remainingMinutes}min`;
  }

  return formatted.trim();
}

export function formatDate(date) {
  const padZero = (num) => String(num).padStart(2, "0");

  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
}

export function redirect(path) {
  window.location.href = path;
}

export function calculateMatchScore(primaryTitle, originalTitle, searchString) {
  const combinedTitle = `${primaryTitle} ${originalTitle}`.toLowerCase();
  const lowerSearch = searchString.toLowerCase();

  let score = 0;

  if (primaryTitle.toLowerCase() === lowerSearch) {
    score += 10;
  }

  if (originalTitle.toLowerCase() === lowerSearch) {
    score += 10;
  }

  if (combinedTitle === lowerSearch) {
    score += 9;
  }

  if (combinedTitle.includes(lowerSearch)) {
    score += 5;
  }

  const searchWords = lowerSearch.split(" ");
  for (let word of searchWords) {
    if (combinedTitle.includes(word)) {
      score += 1;
    }
  }

  return score;
}

export function sortByTitleMatch(arr, searchString) {
  return arr.sort((a, b) => {
    const scoreA = calculateMatchScore(a.primaryTitle, a.originalTitle, searchString);
    const scoreB = calculateMatchScore(b.primaryTitle, b.originalTitle, searchString);

    return scoreB - scoreA;
  });
}

export function filterUniqueTitles(arr) {
  const seenTitles = new Set();
  return arr.filter((movie) => {
    if (!seenTitles.has(movie.original_title)) {
      seenTitles.add(movie.original_title);
      return true;
    }
    return false;
  });
}
