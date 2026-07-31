import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden relative font-sans">
      
      {/* Radial glow background effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Images Container */}
      <div className="absolute inset-0 max-w-5xl mx-auto w-full h-full pointer-events-none hidden md:block">
        {/* Top Left */}
        <div className="absolute top-[15%] left-[15%] w-48 h-32 -rotate-12 shadow-xl rounded-2xl overflow-hidden border-4 border-white">
          <Image src="/assets/loginImage1.jpg" alt="Interior" fill className="object-cover" />
        </div>
        
        {/* Top Center */}
        <div className="absolute top-[5%] left-[45%] w-36 h-48 rotate-6 shadow-xl rounded-2xl overflow-hidden border-4 border-white">
          <Image src="/assets/loginImage2.jpg" alt="Interior" fill className="object-cover" />
        </div>

        {/* Top Right */}
        <div className="absolute top-[18%] right-[15%] w-48 h-32 rotate-[15deg] shadow-xl rounded-2xl overflow-hidden border-4 border-white">
          <Image src="/assets/loginImage1.jpg" alt="Interior" fill className="object-cover" />
        </div>

        {/* Mid Left */}
        <div className="absolute top-[45%] left-[10%] w-40 h-28 -rotate-6 shadow-xl rounded-2xl overflow-hidden border-4 border-white">
          <Image src="/assets/loginImage2.jpg" alt="Interior" fill className="object-cover" />
        </div>

        {/* Mid Right */}
        <div className="absolute top-[40%] right-[12%] w-44 h-32 rotate-3 shadow-xl rounded-2xl overflow-hidden border-4 border-white">
          <Image src="/assets/loginImage1.jpg" alt="Interior" fill className="object-cover" />
        </div>
      </div>

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
