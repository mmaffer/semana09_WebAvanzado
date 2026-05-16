"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { OmdbSearchResult } from "../types/omdb";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

const RESULTS_PER_PAGE = 10; // OMDb siempre devuelve 10 por página

export default function SearchSection() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  const [results, setResults] = useState<OmdbSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Auto-open modal cuando viene ?id= desde la página principal
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setSelectedId(id);
  }, [searchParams]);

  // Debounce: actualiza debouncedQuery 500ms después de que el usuario deja de escribir
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Resetear a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  // Fetch: se dispara cuando cambia debouncedQuery o la página
  // — sin debounce extra al cambiar de página (respuesta inmediata al click)
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      setTotalResults(0);
      return;
    }

    let cancelled = false;

    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery.trim())}&page=${page}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data.Response === "True") {
          setResults(data.Search ?? []);
          setTotalResults(parseInt(data.totalResults) || 0);
        } else {
          setResults([]);
          setTotalResults(0);
          setError(data.Error ?? "No se encontraron resultados");
        }
      } catch {
        if (!cancelled) setError("Error al conectar con el servidor");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchResults();
    return () => { cancelled = true; };
  }, [debouncedQuery, page]);

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClose = useCallback(() => setSelectedId(null), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Buscador */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar películas o series..."
            autoFocus
            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-2xl pl-12 pr-12 py-4 text-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Cargando */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-20">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400 text-lg">{error}</p>
        </div>
      )}

      {/* Estado vacío */}
      {!debouncedQuery && !loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg font-medium">Escribe algo para buscar</p>
          <p className="text-gray-600 text-sm mt-1">Películas, series, documentales...</p>
        </div>
      )}

      {/* Resultados */}
      {results.length > 0 && !loading && (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{totalResults}</span> resultados para{" "}
              <span className="text-amber-400 font-medium">&ldquo;{debouncedQuery}&rdquo;</span>
            </p>
            {totalPages > 1 && (
              <p className="text-gray-500 text-sm">
                Página <span className="text-white font-medium">{page}</span> de{" "}
                <span className="text-white font-medium">{totalPages}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {results.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={() => setSelectedId(movie.imdbID)}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}

      {/* Modal de detalles */}
      {selectedId && <MovieModal movieId={selectedId} onClose={handleClose} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Componente de paginación                                            */
/* ------------------------------------------------------------------ */

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = buildPageRange(page, totalPages);

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1.5 mt-12">
      {/* Anterior */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-600 select-none">
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              aria-current={p === page ? "page" : undefined}
              className={`min-w-[2.25rem] h-9 rounded-lg text-sm font-medium border transition-all ${
                p === page
                  ? "bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:border-amber-500/50 hover:text-amber-400"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Siguiente */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Siguiente
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

/** Genera el rango de páginas con puntos suspensivos donde corresponde */
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}
