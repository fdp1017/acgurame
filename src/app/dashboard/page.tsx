'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/login');
          return;
        }

        // Usar onSnapshot para escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(doc(db, 'usuarios', user.uid), (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          }
          setLoading(false);
        });

        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para formatear números con separador de miles
  const formatNumber = (number: number) => {
    return number?.toLocaleString('es-CO') || '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-32 h-32 relative animate-pulse">
          <Image
            src="/images/logo/ac-gura-high-resolution-logo-transparent.png"
            alt="ACgura Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
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

        {/* Información del Usuario y Balance */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            ¡Bienvenido {userData?.nombre || 'usuario'}!
          </h1>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
            <p className="text-white text-lg">
              Tu balance: <span className="font-bold">${formatNumber(userData?.balance || 0)}</span>
            </p>
          </div>
        </div>

        {/* Botón Principal de Acgurarme */}
        <div className="mb-8">
          <Link href="/dashboard/acgurarme" className="block">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Acgurarme</h2>
                <p className="text-white/90 text-lg max-w-md">
                  Obtén tu seguro por un día de manera rápida y sencilla
                </p>
                <span className="inline-flex items-center text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Crear nueva póliza
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Grid de Menús Secundarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Mi Cuenta */}
          <Link href="/dashboard/micuenta" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full flex flex-col items-center justify-center text-center min-h-[180px]">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Mi Cuenta</h2>
              <p className="text-gray-300 text-sm">
                Gestiona tu perfil y consulta tu historial de actividades
              </p>
            </div>
          </Link>

          {/* Reclamar */}
          <Link href="/dashboard/reclamar" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 h-full flex flex-col items-center justify-center text-center min-h-[180px]">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Reclamar</h2>
              <p className="text-gray-300 text-sm">
                Inicia el proceso de reclamación de tu seguro de manera fácil y rápida
              </p>
            </div>
          </Link>
        </div>

        {/* Botón de Cerrar Sesión */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            Cerrar Sesión
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