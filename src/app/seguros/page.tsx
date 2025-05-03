'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const opcionesSeguros = [
  {
    id: 'recorrido',
    titulo: 'Acgura tu Recorrido',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    descripcion: 'Protección para tus recorridos diarios'
  },
  {
    id: 'entrenamiento',
    titulo: 'Acgura tu Entrenamiento',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    descripcion: 'Seguridad en tus sesiones de entrenamiento'
  },
  {
    id: 'rodada',
    titulo: 'Acgura tu Rodada',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    descripcion: 'Cobertura para tus rodadas grupales'
  },
  {
    id: 'jornal',
    titulo: 'Acgura tu Jornal',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    descripcion: 'Protección para tu jornada laboral'
  },
  {
    id: 'evento',
    titulo: 'Acgura tu Evento',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    descripcion: 'Cobertura para eventos especiales'
  },
  {
    id: 'paseo',
    titulo: 'Acgura tu Paseo',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    ),
    descripcion: 'Seguridad en tus paseos recreativos'
  }
];

export default function SegurosPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Barra de navegación */}
      <nav className="bg-black/30 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <Image
            src="/images/logo/ac-gura-high-resolution-logo-transparent.png"
            alt="ACgura Logo"
            width={120}
            height={40}
            className="w-auto h-8"
          />
          <div className="w-6" /> {/* Espaciador para mantener el logo centrado */}
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opcionesSeguros.map((opcion) => (
            <Link
              key={opcion.id}
              href="/dashboard/acgurarme/cotizar"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400">
                  {opcion.icono}
                </div>
                <h3 className="text-xl font-semibold text-white">{opcion.titulo}</h3>
                <p className="text-white/60 text-sm">{opcion.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Texto de copyright */}
      <footer className="fixed bottom-4 right-4 text-white/40 text-sm">
        © ACgura 2024 - Todos los derechos reservados
      </footer>
    </div>
  );
}