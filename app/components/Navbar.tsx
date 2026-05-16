import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="w-7 h-7 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span className="text-xl font-bold text-white">
              Cine<span className="text-amber-400">Galería</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium text-sm"
            >
              Inicio
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors"
            >
              <svg
                className="w-4 h-4"
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
              Buscar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
