'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoArrowBack } from 'react-icons/io5';

export default function Reclamar() {
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
        {/* Botón de Regresar */}
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-8 left-8 text-white hover:text-white/80 transition-colors duration-300 flex items-center gap-2"
        >
          <IoArrowBack size={24} />
          <span>Volver</span>
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

        {/* Contenido Principal */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Bienvenido al módulo de reclamación de tu póliza Mundial
          </h1>
          
          <p className="text-white text-lg mb-8 leading-relaxed">
            A continuación encontrarás el paso a paso para completar tu proceso de reclamación 
            de tu póliza de la manera más rápida y fácil posible.
            <br /><br />
            Gracias por confiar tu seguridad con nosotros.
          </p>

          <button
            onClick={() => router.push('/dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105"
          >
            Volver al menú principal
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-12">
        ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}