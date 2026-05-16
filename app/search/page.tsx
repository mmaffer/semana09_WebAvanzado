/**
 * Página de Búsqueda — CSR (Client-Side Rendering)
 *
 * Por qué CSR aquí:
 * - La búsqueda depende de la interacción del usuario en tiempo real.
 * - Los resultados cambian con cada tecla; no tiene sentido pre-renderizarlos.
 * - useState y useEffect gestionan estado local sin recargar la página.
 * - SearchSection lleva la directiva "use client" para acceder a los hooks.
 */

import { Suspense } from "react";
import SearchSection from "../components/SearchSection";

export default function SearchPage() {
  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-6">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
            Renderizado en el cliente (CSR)
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Buscar{" "}
            <span className="text-amber-400">Películas y Series</span>
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Resultados en tiempo real mientras escribes
          </p>
        </div>
      </div>

      {/*
        Suspense es requerido por Next.js cuando un Client Component
        usa useSearchParams(), para evitar bloquear el renderizado del servidor.
      */}
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <SearchSection />
      </Suspense>
    </main>
  );
}
