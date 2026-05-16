"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { OmdbDetail } from "../types/omdb";

interface MovieModalProps {
  movieId: string;
  onClose: () => void;
}

export default function MovieModal({ movieId, onClose }: MovieModalProps) {
  const [detail, setDetail] = useState<OmdbDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setError(null);
      setDetail(null);
      try {
        const res = await fetch(`/api/movie/${movieId}`);
        const data: OmdbDetail = await res.json();
        if (data.Response === "False") {
          setError(data.Error || "No se encontraron detalles");
        } else {
          setDetail(data);
        }
      } catch {
        setError("Error al cargar los detalles");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [movieId]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 rounded-full p-2"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center h-64 text-red-400">
            <p>{error}</p>
          </div>
        )}

        {detail && !loading && (
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 sm:w-52 md:w-60">
              {detail.Poster !== "N/A" ? (
                <div className="relative w-full aspect-[2/3]">
                  <Image
                    src={detail.Poster}
                    alt={detail.Title}
                    fill
                    className="object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                    sizes="240px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-800 rounded-t-2xl sm:rounded-l-2xl flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 p-6 min-w-0">
              <div className="flex items-start justify-between gap-4 pr-8">
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {detail.Title}
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm">
                    {detail.Year}
                    {detail.Runtime !== "N/A" && ` · ${detail.Runtime}`}
                    {detail.totalSeasons && ` · ${detail.totalSeasons} temporadas`}
                  </p>
                </div>
                {detail.imdbRating !== "N/A" && (
                  <div className="flex-shrink-0 flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                    <svg
                      className="w-4 h-4 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-amber-400 font-bold text-sm">
                      {detail.imdbRating}
                    </span>
                  </div>
                )}
              </div>

              {detail.Genre !== "N/A" && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {detail.Genre.split(", ").map((genre) => (
                    <span
                      key={genre}
                      className="bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {detail.Plot !== "N/A" && (
                <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                  {detail.Plot}
                </p>
              )}

              <div className="mt-4 space-y-2">
                <DetailRow label="Director" value={detail.Director} />
                <DetailRow label="Reparto" value={detail.Actors} />
                <DetailRow label="Idioma" value={detail.Language} />
                <DetailRow label="País" value={detail.Country} />
                {detail.Awards !== "N/A" && (
                  <DetailRow label="Premios" value={detail.Awards} />
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-700/50 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                {detail.Rated !== "N/A" && <span>Clasificación: {detail.Rated}</span>}
                {detail.Released !== "N/A" && <span>Estreno: {detail.Released}</span>}
                {detail.imdbVotes !== "N/A" && (
                  <span>{detail.imdbVotes} votos en IMDb</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value || value === "N/A") return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 min-w-[80px] flex-shrink-0">{label}:</span>
      <span className="text-gray-300 leading-snug">{value}</span>
    </div>
  );
}
