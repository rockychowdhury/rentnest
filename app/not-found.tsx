
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden relative font-sans">
      
      {/* Radial glow background effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />



      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        <h1 className="text-[12rem] md:text-[20rem] leading-none font-serif text-slate-800 tracking-tight drop-shadow-sm">
          404
        </h1>
        
        <div className="mt-8 mb-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
            Oops! Page Not Found.
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-lg mx-auto">
            Looks like the space you're looking for hasn't been designed yet.
          </p>
        </div>

        <Link 
          href="/"
          className="mt-8 flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-400 text-white px-8 py-4 rounded-full font-medium tracking-wide hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          BACK TO HOME
          <span className="bg-white/20 p-1 rounded-full">
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </Link>
      </div>
    </main>
  );
}
