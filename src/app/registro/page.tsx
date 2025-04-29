'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { registerUser } from '@/firebase/auth';
import PinInput from '@/components/PinInput';
import { enviarCodigoVerificacion, verificarCodigos } from '@/firebase/verification';
import { useFirebase } from '../layout';

export default function Register() {
  const router = useRouter();
  const { auth, db, initialized } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const confirmPinRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1); // 1: Datos personales, 2: Verificación, 3: Crear PIN
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    tipoDocumento: 'cedula', // Valor por defecto establecido a 'cedula'
    numeroDocumento: '',
    email: '',
    celular: '',
    pin: '',
    confirmPin: '',
    codigoVerificacion: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePinComplete = (pin: string, isConfirm: boolean) => {
    setFormData(prev => ({
      ...prev,
      [isConfirm ? 'confirmPin' : 'pin']: pin
    }));
  };

  const handleFirstPinComplete = () => {
    if (confirmPinRef.current) {
      confirmPinRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitDatosPersonales = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!initialized) {
      setError('El sistema está inicializando, por favor espera un momento');
      return;
    }

    // Validar campos
    if (!formData.nombreCompleto || !formData.tipoDocumento || 
        !formData.numeroDocumento || !formData.email || !formData.celular) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    // Validar celular (solo números)
    if (!/^\d+$/.test(formData.celular)) {
      setError('El número de celular solo debe contener números');
      return;
    }

    setLoading(true);

    try {
      // Simulamos el envío del código de verificación
      const enviado = await enviarCodigoVerificacion(formData.celular, formData.email);
      
      if (enviado) {
        setStep(2);
      } else {
        setError('Error al enviar código de verificación. Por favor intenta de nuevo.');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setError('Error al enviar código de verificación. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigos = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!initialized) {
      setError('El sistema está inicializando, por favor espera un momento');
      return;
    }

    if (!formData.codigoVerificacion) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    // Validar que el código sea numérico y de 6 dígitos
    if (!/^\d{6}$/.test(formData.codigoVerificacion)) {
      setError('El código debe ser numérico y tener 6 dígitos');
      return;
    }

    setLoading(true);

    try {
      const codigoValido = await verificarCodigos(formData.codigoVerificacion);
      
      if (codigoValido) {
        setStep(3);
      } else {
        setError('Código de verificación incorrecto');
      }
    } catch (error) {
      setError('Error al verificar el código. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  const handleRegistroFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!initialized) {
      setError('El sistema está inicializando, por favor espera un momento');
      return;
    }

    if (!formData.pin || !formData.confirmPin) {
      setError('Por favor completa ambos campos de PIN');
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      setError('Los PINs no coinciden');
      return;
    }

    if (formData.pin.length !== 4) {
      setError('El PIN debe tener 4 dígitos');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        nombreCompleto: formData.nombreCompleto,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        email: formData.email,
        celular: formData.celular,
        pin: formData.pin,
        saldo: 20000,
        verificado: true,
        auth,
        db
      });

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      setError(error.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  // Renderizado condicional según el paso actual
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmitDatosPersonales} className="w-full space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="space-y-4">
              <input
                type="text"
                name="nombreCompleto"
                placeholder="Nombre Completo"
                value={formData.nombreCompleto}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
              />

              <div className="flex gap-4">
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
                >
                  <option value="cedula" className="bg-gray-800">CC</option>
                  <option value="pasaporte" className="bg-gray-800">Pasaporte</option>
                  <option value="cedulaExtranjeria" className="bg-gray-800">CE</option>
                </select>

                <input
                  type="text"
                  name="numeroDocumento"
                  placeholder="Número de Documento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-2/3 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
              />

              <input
                type="tel"
                name="celular"
                placeholder="Número de Celular"
                value={formData.celular}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-white text-black rounded-full font-semibold mt-8 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Enviando código...' : 'Continuar'}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerificarCodigos} className="w-full space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="space-y-6">
              <div>
                <p className="text-white text-center mb-4">
                  Hemos enviado un código de verificación a tu celular y correo electrónico
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">
                      Código de verificación
                    </label>
                    <input
                      type="text"
                      name="codigoVerificacion"
                      placeholder="Ingresa el código de 6 dígitos"
                      value={formData.codigoVerificacion}
                      onChange={handleChange}
                      maxLength={6}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
                    />
                    <p className="text-gray-400 text-sm mt-2 text-center">
                      El código ha sido enviado a:<br />
                      {formData.celular} y {formData.email}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Verificando...' : 'Verificar código'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 px-6 border border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Volver
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleRegistroFinal} className="w-full space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-300 text-sm text-center mb-4">
                  Crea tu PIN de 4 dígitos
                </p>
                <PinInput 
                  onChange={(pin) => handlePinComplete(pin, false)}
                  onComplete={handleFirstPinComplete}
                  autoFocus={true}
                />
              </div>

              <div className="space-y-2" ref={confirmPinRef}>
                <p className="text-gray-300 text-sm text-center mb-4">
                  Confirma tu PIN
                </p>
                <PinInput 
                  onChange={(pin) => handlePinComplete(pin, true)}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Registrando...' : 'Crear cuenta'}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 px-6 border border-white/20 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Volver
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="w-full flex items-center justify-between mb-12">
          <Link href="/login" className="text-white hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>

          <div className="w-48 h-48 relative group">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500"></div>
            <Image
              src="/images/logo/ac-gura-high-resolution-logo-transparent.png"    
              alt="ACgura Logo"
              fill
              className="object-contain brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-105 transition-transform duration-500"      
              priority
            />
          </div>
          <div className="w-8" />
        </div>

        <h1 className="text-center text-white text-3xl font-bold mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {step === 1 ? 'Registro de Usuario' : 
           step === 2 ? 'Verificación' : 
           'Crear PIN'}
        </h1>

        {renderStep()}

        <div className="mt-8 text-center">
          <Link 
            href="/politica-datos" 
            className="text-gray-300 hover:text-white text-sm hover:underline transition-colors"
          >
            Política de Tratamiento de Datos
          </Link>

          <footer className="mt-8 text-gray-400 text-sm">
            ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
          </footer>
        </div>
      </div>
    </main>
  );
}