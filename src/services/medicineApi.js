const BASE_URL = "https://api.fda.gov/drug/label.json";

const cache = new Map();

export async function searchMedicines(query, signal) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }


  if (cache.has(normalizedQuery)) {
    return cache.get(normalizedQuery);
  }

  const searchQuery = `openfda.brand_name:"${normalizedQuery}"`;

  const url =
    `${BASE_URL}?search=${encodeURIComponent(searchQuery)}&limit=20`;

  const response = await fetch(url, {
    signal,
  });

  
  if (response.status === 404) {
    cache.set(normalizedQuery, []);
    return [];
  }

  if (!response.ok) {
    throw new Error("Failed to fetch medicine data");
  }

  const data = await response.json();

  const results = data.results || [];

  cache.set(normalizedQuery, results);

  return results;
}