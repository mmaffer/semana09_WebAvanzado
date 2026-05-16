"use client";

import Image from "next/image";
import Link from "next/link";
import type { OmdbSearchResult } from "../types/omdb";

interface MovieCardProps {
  movie: OmdbSearchResult;
  onClick?: () => void;
  href?: string;
}

export default function MovieCard({ movie, onClick, href }: MovieCardProps) {
  const typeLabel =
    movie.Type === "series"
      ? "Serie"
      : movie.Type === "movie"
      ? "Película"
      : "Episodio";

  const content = (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700/50 hover:border-amber-500/40 shadow-lg hover:shadow-amber-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
      <div className="relative aspect-[2/3] w-full">
        {movie.Poster !== "N/A" ? (
          <Image
            src={movie.Poster}
            alt={movie.Title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex flex-col items-center justify-center gap-2">
            <svg
              className="w-10 h-10 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-500 text-xs">Sin imagen</span>
          </div>
        )}
        {/* Hover overlay — gradiente inferior + botón */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-amber-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            Ver detalles
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">
          {movie.Title}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-gray-400 text-xs">{movie.Year}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              movie.Type === "series"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-amber-500/20 text-amber-400"
            }`}
          >
            {typeLabel}
          </span>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
