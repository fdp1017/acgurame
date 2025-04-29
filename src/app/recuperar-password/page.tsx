'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/config';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Por favor, ingresa tu correo electrónico');
      }

      if (!auth) {
        setError('Error interno de autenticación. Intenta más tarde.');
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      let errorMessage = 'Error al enviar el correo de recuperación';
      
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Por favor, intenta más tarde';
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Video Background */}
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-12">
          <Link href="/login" className="text-white hover:scale-110 transition-transform flex items-center gap-2">
            <IoArrowBack size={24} />
            <span>Volver</span>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <h2 className="text-2xl text-white font-semibold text-center mb-6">
            Recuperar PIN
          </h2>

          <p className="text-gray-300 text-sm text-center mb-6">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu PIN
          </p>

          {success ? (
            <div className="text-green-400 text-center p-4 bg-green-400/10 rounded-lg">
              Hemos enviado las instrucciones a tu correo electrónico. Por favor, revisa tu bandeja de entrada.
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
              />

              {error && (
                <p className="text-red-400 text-sm text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}