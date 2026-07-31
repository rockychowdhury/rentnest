import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
      <div className="relative flex flex-col items-center">

        <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full" />
        
        <div className="relative bg-white p-4 rounded-full shadow-lg mb-6">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-slate-800 tracking-tight animate-pulse">
          RentNest
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Preparing your space...
        </p>
      </div>
    </div>
  );
}
