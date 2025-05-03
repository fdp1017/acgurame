'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Datos de prueba para el desarrollo
const datosEjemplo = {
  usuario: {
    nombre: "Usuario de Prueba",
    saldo: 500000
  },
  polizasActivas: [
    {
      id: "POL001",
      tipo: "Accidentes Personales",
      fechaInicio: "2024-02-20",
      fechaFin: "2024-02-21",
      estado: "activa",
      cobertura: 1000000
    },
    {
      id: "POL002",
      tipo: "Accidentes Personales",
      fechaInicio: "2024-02-22",
      fechaFin: "2024-02-23",
      estado: "pendiente",
      cobertura: 2000000
    }
  ]
};

export default function DashboardPage() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Barra de navegación superior */}
      <nav className="bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Flecha de regresar */}
          <button
            onClick={() => router.back()}
            className="text-white hover:text-blue-400 transition-colors mr-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/images/logo/ac-gura-high-resolution-logo-transparent.png"
              alt="ACgura Logo"
              width={180}
              height={60}
              className="w-auto h-12"
            />
          </div>
          {/* Menú de usuario */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-2 rounded-full text-white hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menú desplegable */}
      {menuAbierto && (
        <div className="absolute right-0 mt-2 w-48 bg-black/70 backdrop-blur-sm rounded-md shadow-lg py-1 z-10">
          <Link href="/perfil" className="block px-4 py-2 text-sm text-white hover:bg-white/10">
            Mi Perfil
          </Link>
          <Link href="/configuracion" className="block px-4 py-2 text-sm text-white hover:bg-white/10">
            Configuración
          </Link>
          <hr className="my-1 border-white/20" />
          <Link href="/logout" className="block px-4 py-2 text-sm text-red-400 hover:bg-white/10">
            Cerrar Sesión
          </Link>
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Botón principal de Acgurarme */}
          <Link 
            href="/seguros"
            className="group relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Acgurarme</h2>
              <p className="text-white/80">Obtén tu seguro por un día de manera rápida y sencilla</p>
              <span className="inline-flex items-center text-white font-medium">
                Crear nueva póliza
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Contenedor de botones secundarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mi Cuenta */}
            <Link 
              href="/perfil"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Mi Cuenta</h3>
                  <p className="text-white/60 text-sm">Gestiona tu perfil y saldo</p>
                </div>
              </div>
            </Link>

            {/* Reclamar */}
            <Link 
              href="/reclamar"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Reclamar</h3>
                  <p className="text-white/60 text-sm">Gestiona tus reclamaciones</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer con derechos reservados */}
      <footer className="w-full text-center py-4 text-white/40 text-sm">
        © ACgura 2024 - Todos los derechos reservados | Powered by DataPaga
      </footer>
    </div>
  );
}