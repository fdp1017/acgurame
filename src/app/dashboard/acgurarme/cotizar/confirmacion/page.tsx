'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/firebase/config';
import { IoArrowBack } from 'react-icons/io5';

interface DatosCotizacion {
  tipoSeguro: string;
  fechaInicio: string;
  horaInicio: string;
  diasSeguro: number;
  primaTotal: number;
  codigoPromocional?: string;
  numeroPoliza?: string;
  valorCobertura: number; // Añadido este campo
}

export default function Confirmacion() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [datosCotizacion, setDatosCotizacion] = useState<DatosCotizacion | null>(null);
  const [error, setError] = useState<string>('');
  const [numeroPoliza, setNumeroPoliza] = useState<string>('0000001');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/login');
          return;
        }

        // Obtener datos de la cotización del localStorage
        const cotizacionGuardada = localStorage.getItem('datosCotizacion');
        if (!cotizacionGuardada) {
          router.push('/dashboard/acgurarme/cotizar');
          return;
        }

        const datos: DatosCotizacion = JSON.parse(cotizacionGuardada);
        console.log('Datos de cotización:', datos); // Debug
        setDatosCotizacion(datos);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor intente nuevamente.');
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const formatDateTime = (fecha: string, hora: string): string => {
    const fechaHora = new Date(`${fecha}T${hora}`);
    return fechaHora.toLocaleString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/\b\w/g, l => l.toUpperCase());
  };

  const calcularFechaFin = (): string => {
    if (!datosCotizacion) return '';
    const fechaInicio = new Date(`${datosCotizacion.fechaInicio}T${datosCotizacion.horaInicio}`);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + datosCotizacion.diasSeguro);
    return formatDateTime(
      fechaFin.toISOString().split('T')[0],
      datosCotizacion.horaInicio
    );
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Contenido Principal */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="w-40 h-40 relative">
              <Image
                src="/images/logo/ac-gura-high-resolution-logo-transparent.png"
                alt="ACgura Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white mb-8">
              ¡Felicitaciones, estás asegurado!
            </h1>

            <p className="text-2xl text-white">
              Tu póliza número <span className="font-bold">{numeroPoliza}</span> fue emitida con éxito.
            </p>
            
            <p className="text-xl text-white">
              Empieza el{' '}
              <span className="font-bold">
                {datosCotizacion && formatDateTime(datosCotizacion.fechaInicio, datosCotizacion.horaInicio)}
              </span>
            </p>

            <p className="text-xl text-white">
              Finaliza el{' '}
              <span className="font-bold">
                {calcularFechaFin()}
              </span>
            </p>

            <p className="text-xl text-white">
              Duración de la cobertura:{' '}
              <span className="font-bold">
                {datosCotizacion?.diasSeguro} días
              </span>
            </p>

            <p className="text-xl text-white">
              Estás cubierto por{' '}
              <span className="font-bold">
                ${datosCotizacion && formatNumber(datosCotizacion.valorCobertura)}
              </span>
            </p>

            <p className="text-xl text-white">
              El valor de tu prima fue{' '}
              <span className="font-bold">
                ${formatNumber(datosCotizacion?.primaTotal || 0)}
              </span>
            </p>

            <div className="mt-8">
              <Link
                href="/terminos"
                target="_blank"
                className="text-white/80 hover:text-white underline block mb-8"
              >
                Ver términos y condiciones de la póliza
              </Link>

              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300"
              >
                Regresar al Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-12">
          ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}