import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#121212] flex items-center justify-center p-6 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap');
        .font-serif-italic { font-family: 'Playfair Display', serif; font-style: italic; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>

      {/* --- Background Decorative Elements --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6A665] opacity-5 blur-[120px] rounded-full" />
        
        {/* Geometric Pattern (Subtle Background) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] animate-spin-slow">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-white fill-none" strokeWidth="0.5">
             <circle cx="100" cy="100" r="90" />
             <path d="M100 10 L178 155 L22 155 Z" />
             <path d="M100 190 L178 45 L22 45 Z" />
             <circle cx="100" cy="100" r="40" />
             <circle cx="100" cy="100" r="20" />
           </svg>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto space-y-8 animate-in fade-in zoom-in duration-700">
        
        {/* 404 Number */}
        <h1 className="text-[120px] md:text-[180px] leading-none font-serif-italic text-transparent bg-clip-text bg-gradient-to-b from-[#C6A665] to-[#8A7038] select-none">
          404
        </h1>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif-italic text-white">
            Path Not Found
          </h2>
          <p className="text-gray-400 font-sans font-light text-sm md:text-base max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved. 
            Return to the center to find your way again.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <a 
            href="/"
            className="group flex items-center space-x-2 bg-[#C6A665] text-[#121212] px-8 py-3.5 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(198,166,101,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
          >
            <Home size={16} strokeWidth={2.5} />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase font-sans">
              Return Home
            </span>
          </a>

          <button 
            onClick={() => window.history.back()}
            className="group flex items-center space-x-2 px-8 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase font-sans group-hover:text-[#C6A665] transition-colors">
              Go Back
            </span>
          </button>
        </div>

      </div>
      
      {/* Footer Text */}
      <div className="absolute bottom-8 text-center">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#C6A665]/40 uppercase font-sans">
          Inventory Managemebnt System
        </span>
      </div>

    </div>
  );
}