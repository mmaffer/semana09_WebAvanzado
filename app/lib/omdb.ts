import type { OmdbDetail, OmdbSearchResponse, OmdbSearchResult } from "../types/omdb";

const API_KEY = "f1def80d";
const BASE_URL = "https://www.omdbapi.com";

export async function getMovieDetail(id: string): Promise<OmdbDetail> {
  const res = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${id}`, {
    next: { revalidate: 3600 },
  });
  return res.json();
}

export async function searchMovies(query: string): Promise<OmdbSearchResponse> {
  const res = await fetch(
    `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  return res.json();
}

export async function getPopularMovies(): Promise<OmdbSearchResult[]> {
  const popularSearches = ["avengers", "batman", "spider-man", "star wars"];

  const results = await Promise.all(
    popularSearches.map((s) =>
      fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${s}&type=movie`, {
        next: { revalidate: 3600 },
      }).then((r) => r.json() as Promise<OmdbSearchResponse>)
    )
  );

  const movies: OmdbSearchResult[] = [];
  const seen = new Set<string>();

  for (const result of results) {
    if (result.Search) {
      for (const movie of result.Search.slice(0, 5)) {
        if (!seen.has(movie.imdbID) && movie.Poster !== "N/A") {
          seen.add(movie.imdbID);
          movies.push(movie);
        }
      }
    }
  }

  return movies;
}
