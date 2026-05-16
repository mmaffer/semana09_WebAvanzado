export interface OmdbSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie" | "series" | "episode";
  Poster: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchResult[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface OmdbDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  totalSeasons?: string;
  Response: string;
  Error?: string;
}
