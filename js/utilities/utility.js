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

export function filterUniqueTitles(arr) {
  const seenTitles = new Set();
  const allDefined = arr.every((item) => item);

  if (allDefined) {
    return arr.filter((movie) => {
      if (!seenTitles.has(movie.original_title)) {
        seenTitles.add(movie.original_title);
        return true;
      }
      return false;
    });
  }
  return [];
}
