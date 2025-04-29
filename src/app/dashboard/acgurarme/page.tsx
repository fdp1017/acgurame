'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Cotizar() {
  const router = useRouter();
  const [codigoPromocional, setCodigoPromocional] = useState('');
  const [tipoSeguro, setTipoSeguro] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [diasSeguro, setDiasSeguro] = useState(1);

  // Establecer fecha y hora actual por defecto
  useEffect(() => {
    const ahora = new Date();
    const fechaActual = ahora.toISOString().split('T')[0];
    const horaActual = ahora.getHours().toString().padStart(2, '0') + ':00';
    setFechaInicio(fechaActual);
    setHoraInicio(horaActual);
  }, []);

  const calcularPrima = () => {
    const valorDia = tipoSeguro === '2000000' ? 3000 : 5500;
    return valorDia * diasSeguro;
  };

  const calcularFechaFin = () => {
    if (!fechaInicio || !horaInicio) return '';
    const fecha = new Date(`${fechaInicio}T${horaInicio}`);
    fecha.setDate(fecha.getDate() + diasSeguro);
    return fecha.toLocaleString('es-CO');
  };

  const incrementarDias = () => {
    if (diasSeguro < 99) {
      setDiasSeguro(diasSeguro + 1);
    }
  };

  const decrementarDias = () => {
    if (diasSeguro > 1) {
      setDiasSeguro(diasSeguro - 1);
    }
  };

  const incrementarFecha = () => {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + 1);
    setFechaInicio(fecha.toISOString().split('T')[0]);
  };

  const decrementarFecha = () => {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() - 1);
    setFechaInicio(fecha.toISOString().split('T')[0]);
  };

  const incrementarHora = () => {
    const [horas] = horaInicio.split(':');
    let nuevaHora = parseInt(horas) + 1;
    if (nuevaHora > 23) nuevaHora = 0;
    setHoraInicio(`${nuevaHora.toString().padStart(2, '0')}:00`);
  };

  const decrementarHora = () => {
    const [horas] = horaInicio.split(':');
    let nuevaHora = parseInt(horas) - 1;
    if (nuevaHora < 0) nuevaHora = 23;
    setHoraInicio(`${nuevaHora.toString().padStart(2, '0')}:00`);
  };

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

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Botón de Regreso */}
        <Link href="/dashboard/acgurarme" className="absolute top-8 left-8 text-white hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>

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

        {/* Formulario de Cotización */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Cotiza tu Seguro
          </h1>

          {/* Código Promocional */}
          <div className="mb-6">
            <label className="block text-white mb-2">Código Promocional (opcional)</label>
            <input
              type="text"
              value={codigoPromocional}
              onChange={(e) => setCodigoPromocional(e.target.value)}
              className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Ingresa tu código promocional"
            />
          </div>

          {/* Tipo de Seguro */}
          <div className="mb-6">
            <label className="block text-white mb-2">Selecciona tu cobertura</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTipoSeguro('2000000')}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  tipoSeguro === '2000000'
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="text-lg font-semibold">$2.000.000</div>
                <div className="text-sm">$3.000 por día</div>
              </button>
              <button
                onClick={() => setTipoSeguro('5000000')}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  tipoSeguro === '5000000'
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="text-lg font-semibold">$5.000.000</div>
                <div className="text-sm">$5.500 por día</div>
              </button>
            </div>
          </div>

          {/* Fecha y Hora de Inicio */}
          <div className="mb-6">
            <label className="block text-white mb-2">Fecha y Hora de Inicio</label>
            <div className="flex gap-4">
              {/* Selector de Fecha */}
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={decrementarFecha}
                  className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={incrementarFecha}
                  className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Selector de Hora */}
              <div className="flex-1 flex items-center gap-2">
                <button
                  onClick={decrementarHora}
                  className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={incrementarHora}
                  className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Días de Seguro */}
          <div className="mb-6">
            <label className="block text-white mb-2">Días de Seguro</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={decrementarDias}
                className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                min="1"
                max="99"
                value={diasSeguro}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 99) {
                    setDiasSeguro(value);
                  }
                }}
                className="w-20 bg-white/10 text-white px-4 py-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                onClick={incrementarDias}
                className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Resumen y Prima */}
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <div className="text-white mb-2">
              <span className="font-semibold">Fecha de Inicio:</span> {new Date(fechaInicio).toLocaleDateString('es-CO')} {horaInicio}
            </div>
            <div className="text-white mb-2">
              <span className="font-semibold">Fecha de Finalización:</span> {calcularFechaFin()}
            </div>
            <div className="text-white text-sm mb-2">
              <span className="font-semibold">Cálculo de la Prima:</span>
              <div className="ml-4">
                {tipoSeguro === '2000000' ? '$3.000' : '$5.500'} (valor por día) × {diasSeguro} días
              </div>
            </div>
            <div className="text-white text-xl font-bold">
              <span className="font-semibold">Prima Total:</span> ${calcularPrima().toLocaleString('es-CO')}
            </div>
          </div>

          {/* Botón de Continuar */}
<button
  onClick={() => {
    // Guardar los datos en localStorage para que la página de confirmación los pueda leer
    const datosCotizacion = {
      tipoSeguro,
      fechaInicio,
      horaInicio,
      diasSeguro,
      primaTotal: calcularPrima(),
      codigoPromocional
    };
    localStorage.setItem('datosCotizacion', JSON.stringify(datosCotizacion));
    router.push('/dashboard/acgurarme/cotizar/confirmacion');
  }}
  className="w-full bg-blue-500/80 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300"
>
  Continuar
</button>

// ... (resto del código se mantiene igual)
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}