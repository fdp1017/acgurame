'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Terminos() {
  const router = useRouter();

  return (
    <main className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Botón de Regreso */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-8 left-8 text-white hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        {/* Header con Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-40 h-40 relative group">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500"></div>
            <Image
              src="/images/logo/ac-gura-high-resolution-logo-transparent.png"
              alt="ACgura Logo"
              fill
              className="object-contain brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          Términos y Condiciones
        </h1>

        {/* Contenedor del PDF */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8">
          <div className="w-full aspect-[1/1.4] relative">
            <iframe
              src="/images/poliza/EJEMPLOCLAUSULADOAPWEB7X24.pdf"
              className="w-full h-full absolute inset-0 rounded-lg"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}