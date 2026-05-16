/**
 * Página Principal — SSR (Server-Side Rendering)
 *
 * Por qué SSR aquí:
 * - Los datos de películas populares no cambian por usuario ni en tiempo real.
 * - Renderizar en el servidor mejora el SEO y el tiempo hasta el primer byte (TTFB).
 * - Next.js ejecuta getPopularMovies() antes de enviar el HTML al cliente.
 */

import Link from "next/link";
import MovieCard from "./components/MovieCard";
import { getPopularMovies } from "./lib/omdb";

export default async function Home() {
  const movies = await getPopularMovies();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
          Renderizado en el servidor (SSR)
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Películas{" "}
          <span className="text-amber-400">Populares</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
          Descubre las películas más reconocidas del cine. Haz clic en cualquier
          título para ver todos sus detalles.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 mt-7 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg shadow-amber-500/20"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Buscar más títulos
        </Link>
      </div>

      {/* Movie grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              href={`/search?id=${movie.imdbID}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          No se pudieron cargar las películas. Intenta más tarde.
        </div>
      )}
    </main>
  );
}
