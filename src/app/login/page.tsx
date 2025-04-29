'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../firebase/auth';
import { useFirebase } from '../../context/FirebaseContext';
import { IoArrowBack } from 'react-icons/io5';

const PinInput = ({ onPinComplete }: { onPinComplete: (pin: string) => void }) => {
  const [pin, setPin] = useState(['', '', '', '']);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (newPin.every(digit => digit !== '')) {
      onPinComplete(newPin.join(''));
    }

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center gap-3">
      {pin.map((digit, index) => (
        <input
          key={index}
          id={`pin-${index}`}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 border-2 border-gray-700 rounded-lg text-center text-xl font-semibold focus:border-white focus:outline-none bg-transparent text-white"
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const { auth, db, initialized, error: firebaseError } = useFirebase();
  const [formData, setFormData] = useState({
    tipoDocumento: 'cedula',
    numeroDocumento: '',
    pin: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPin, setShowForgotPin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePinComplete = (pin: string) => {
    setFormData(prev => ({
      ...prev,
      pin
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowForgotPin(false);

    try {
      if (!initialized) {
        throw new Error('Firebase aún no está inicializado');
      }

      if (!formData.tipoDocumento || !formData.numeroDocumento || !formData.pin) {
        throw new Error('Por favor, completa todos los campos');
      }

      const result = await loginUser(auth, db, formData.tipoDocumento, formData.numeroDocumento, formData.pin);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Error al iniciar sesión');
        if (result.shouldRedirectToRegister) {
          setTimeout(() => {
            router.push('/registro');
          }, 2000);
        }
        if (result.shouldShowForgotPin) {
          setShowForgotPin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPin = () => {
    router.push('/recuperar-password');
  };

  useEffect(() => {
    if (firebaseError) {
      setError(firebaseError.message);
    }
  }, [firebaseError]);

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
          <Link href="/" className="text-white hover:scale-110 transition-transform flex items-center gap-2">
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

        <form onSubmit={handleSubmit} className="w-full space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <div className="space-y-4">
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
                className="w-2/3 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-white/40 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <p className="text-gray-300 text-sm text-center mb-4">
                Ingresa tu PIN de 4 dígitos
              </p>
              <PinInput onPinComplete={handlePinComplete} />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPin}
              className="text-white/80 hover:text-white text-sm underline"
            >
              ¿Olvidaste tu PIN?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-white text-black rounded-full font-semibold mt-8 hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="text-center text-gray-300 text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/registro" className="text-white hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <div className="text-center mt-4">
            <Link
              href="/politica-datos"
              className="text-white/60 hover:text-white/80 text-sm"
            >
              Política de tratamiento de datos
            </Link>
          </div>
        </form>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}