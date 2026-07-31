"use client";

import { useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden relative font-sans">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute inset-0 max-w-5xl mx-auto w-full h-full pointer-events-none hidden md:block opacity-50">
        <div className="absolute top-[15%] left-[20%] w-48 h-32 -rotate-6 shadow-xl rounded-2xl overflow-hidden border-4 border-white grayscale">
          <Image src="/assets/loginImage2.jpg" alt="Interior" fill className="object-cover" />
        </div>
        <div className="absolute top-[40%] right-[20%] w-44 h-32 rotate-6 shadow-xl rounded-2xl overflow-hidden border-4 border-white grayscale">
          <Image src="/assets/loginImage1.jpg" alt="Interior" fill className="object-cover" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        
        <h1 className="text-[8rem] md:text-[14rem] leading-none font-serif text-slate-800 tracking-tight drop-shadow-sm">
          500
        </h1>
        
        <div className="mt-4 mb-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
            Something went wrong.
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-lg mx-auto">
            We've encountered an unexpected issue while designing your experience.
          </p>
        </div>

        <button 
          onClick={() => reset()}
          className="mt-8 flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-400 text-white px-8 py-4 rounded-full font-medium tracking-wide hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          TRY AGAIN
          <span className="bg-white/20 p-1 rounded-full">
            <RotateCcw className="w-5 h-5" />
          </span>
        </button>
      </div>
    </main>
  );
}