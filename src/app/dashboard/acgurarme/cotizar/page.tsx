'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth, db } from '@/firebase/config';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where,
  orderBy, 
  limit, 
  getDocs, 
  setDoc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { IoArrowBack } from 'react-icons/io5';

interface SeguroOpcion {
  id: string;
  nombre: string;
  descripcion: string;
  valorCobertura: number;
  valorPrima: number;
  diasCobertura: number;
}

interface CodigoPromo {
  codigo: string;
  descuento: number;
  opcionSeguroId: string;
  diasCobertura: number;
}

export default function Cotizar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [opcionesSeguro, setOpcionesSeguro] = useState<SeguroOpcion[]>([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string>('');
  const [codigoPromo, setCodigoPromo] = useState('');
  const [codigoPromoValido, setCodigoPromoValido] = useState<CodigoPromo | null>(null);
  const [error, setError] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [numDias, setNumDias] = useState(1);
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        const opcionesRef = collection(db, 'opcionesSeguro');
        const opcionesSnapshot = await getDocs(opcionesRef);
        const opciones: SeguroOpcion[] = [];
        opcionesSnapshot.forEach((doc) => {
          opciones.push({ id: doc.id, ...doc.data() } as SeguroOpcion);
        });
        setOpcionesSeguro(opciones);

        // Configurar fecha y hora inicial
        const ahora = new Date();
        const siguienteHora = new Date(ahora.setHours(ahora.getHours() + 1, 0, 0, 0));
        setFechaInicio(siguienteHora.toISOString().split('T')[0]);
        setHoraInicio(siguienteHora.toTimeString().slice(0, 5));
        
        // Calcular fecha y hora de fin inicial
        const fechaFinInicial = new Date(siguienteHora);
        fechaFinInicial.setDate(fechaFinInicial.getDate() + 1);
        setFechaFin(fechaFinInicial.toISOString().split('T')[0]);
        setHoraFin(siguienteHora.toTimeString().slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const verificarCodigoPromo = async (codigo: string) => {
    try {
      const codigosRef = collection(db, 'codigosPromo');
      const q = query(codigosRef, where('codigo', '==', codigo));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const codigoData = querySnapshot.docs[0].data() as CodigoPromo;
        setCodigoPromoValido(codigoData);
        setOpcionSeleccionada(codigoData.opcionSeguroId);
        setNumDias(codigoData.diasCobertura);
        actualizarFechaFin(fechaInicio, horaInicio, codigoData.diasCobertura);
      } else {
        setCodigoPromoValido(null);
        setError('Código promocional no válido');
      }
    } catch (error) {
      console.error('Error al verificar código:', error);
      setError('Error al verificar el código');
    }
  };

  const limpiarCodigoPromo = () => {
    setCodigoPromo('');
    setCodigoPromoValido(null);
    setError('');
  };

  const actualizarFechaFin = (fecha: string, hora: string, dias: number) => {
    const fechaHoraInicio = new Date(`${fecha}T${hora}`);
    const fechaHoraFin = new Date(fechaHoraInicio);
    fechaHoraFin.setDate(fechaHoraInicio.getDate() + dias);
    setFechaFin(fechaHoraFin.toISOString().split('T')[0]);
    setHoraFin(hora);
  };

  const handleFechaHoraInicioChange = (fecha: string, hora: string) => {
    const ahora = new Date();
    const fechaHoraSeleccionada = new Date(`${fecha}T${hora}`);
    
    if (fechaHoraSeleccionada < ahora) {
      setError('No se puede seleccionar una fecha y hora anterior a la actual');
      return;
    }

    setFechaInicio(fecha);
    setHoraInicio(hora);
    actualizarFechaFin(fecha, hora, numDias);
  };

  const incrementarFecha = () => {
    const fecha = new Date(`${fechaInicio}T${horaInicio}`);
    fecha.setDate(fecha.getDate() + 1);
    handleFechaHoraInicioChange(
      fecha.toISOString().split('T')[0],
      horaInicio
    );
  };

  const decrementarFecha = () => {
    const fecha = new Date(`${fechaInicio}T${horaInicio}`);
    const ahora = new Date();
    fecha.setDate(fecha.getDate() - 1);
    
    if (fecha >= ahora) {
      handleFechaHoraInicioChange(
        fecha.toISOString().split('T')[0],
        horaInicio
      );
    }
  };

  const incrementarHora = () => {
    const fecha = new Date(`${fechaInicio}T${horaInicio}`);
    fecha.setHours(fecha.getHours() + 1);
    handleFechaHoraInicioChange(
      fecha.toISOString().split('T')[0],
      fecha.toTimeString().slice(0, 5)
    );
  };

  const decrementarHora = () => {
    const fecha = new Date(`${fechaInicio}T${horaInicio}`);
    const ahora = new Date();
    fecha.setHours(fecha.getHours() - 1);
    
    if (fecha >= ahora) {
      handleFechaHoraInicioChange(
        fecha.toISOString().split('T')[0],
        fecha.toTimeString().slice(0, 5)
      );
    }
  };

  const activarSeguro = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      const opcionSeguro = opcionesSeguro.find(o => o.id === opcionSeleccionada);
      if (!opcionSeguro) {
        setError('Por favor seleccione una opción de seguro');
        return;
      }

      // Verificar que la fecha y hora de inicio no sea anterior a la actual
      const ahora = new Date();
      const fechaHoraInicio = new Date(`${fechaInicio}T${horaInicio}`);
      if (fechaHoraInicio < ahora) {
        setError('La fecha y hora de inicio no puede ser anterior a la actual');
        return;
      }

      // Obtener el último número de póliza
      const polizasRef = collection(db, 'seguros');
      const q = query(polizasRef, orderBy('numeroPoliza', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      let ultimoNumero = 0;
      if (!querySnapshot.empty) {
        const ultimaPoliza = querySnapshot.docs[0].data();
        ultimoNumero = parseInt(ultimaPoliza.numeroPoliza || '0');
      }

      // Crear nuevo número de póliza
      const nuevoNumeroPoliza = String(ultimoNumero + 1).padStart(7, '0');

      // Calcular valor de la prima
      const valorPrima = codigoPromoValido
        ? opcionSeguro.valorPrima * (1 - codigoPromoValido.descuento)
        : opcionSeguro.valorPrima;

      // Verificar saldo suficiente
      if (userData.balance < valorPrima) {
        setError('Saldo insuficiente para activar el seguro');
        return;
      }

      // Crear el documento de la póliza
      const fechaHoraFin = new Date(`${fechaFin}T${horaFin}`);
      const seguroData = {
        userId: user.uid,
        numeroPoliza: nuevoNumeroPoliza,
        fechaInicio: fechaHoraInicio.toISOString(),
        fechaFin: fechaHoraFin.toISOString(),
        valorCobertura: opcionSeguro.valorCobertura,
        valorPrima: valorPrima,
        estado: 'Inactiva',
        createdAt: serverTimestamp(),
        opcionSeguroId: opcionSeleccionada,
        codigoPromoAplicado: codigoPromoValido?.codigo || null
      };

      // Guardar la póliza
      await setDoc(doc(db, 'seguros', `${user.uid}_${Date.now()}`), seguroData);

      // Actualizar el balance del usuario
      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, {
        balance: increment(-valorPrima)
      });

      router.push('/dashboard/acgurarme/cotizar/confirmacion');
    } catch (error) {
      console.error('Error al activar seguro:', error);
      setError('Error al activar el seguro. Por favor intente nuevamente.');
    }
  };

  const formatNumber = (number: number) => {
    return number.toLocaleString('es-CO');
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
        {/* Botón de Regresar */}
        <button
          onClick={() => router.push('/dashboard/acgurarme')}
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
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Configura tu Seguro
          </h1>

          {error && (
            <div className="bg-red-500/80 text-white p-3 rounded-lg text-center mb-6">
              {error}
            </div>
          )}

          {/* Código Promocional */}
          <div className="mb-8">
            <div className="flex gap-4 mb-2">
              <input
                type="text"
                value={codigoPromo}
                onChange={(e) => setCodigoPromo(e.target.value.toUpperCase())}
                placeholder="Código promocional"
                className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                disabled={codigoPromoValido !== null}
              />
              {codigoPromoValido ? (
                <button
                  onClick={limpiarCodigoPromo}
                  className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Limpiar
                </button>
              ) : (
                <button
                  onClick={() => verificarCodigoPromo(codigoPromo)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Verificar
                </button>
              )}
            </div>
            {codigoPromoValido && (
              <p className="text-green-400 text-sm">
                ¡Código válido! Descuento del {codigoPromoValido.descuento * 100}%
              </p>
            )}
          </div>

          {/* Opciones de Seguro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {opcionesSeguro.map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => {
                  if (!codigoPromoValido) {
                    setOpcionSeleccionada(opcion.id);
                    setNumDias(opcion.diasCobertura);
                    actualizarFechaFin(fechaInicio, horaInicio, opcion.diasCobertura);
                  }
                }}
                disabled={codigoPromoValido !== null && opcion.id !== codigoPromoValido.opcionSeguroId}
                className={`p-6 rounded-xl text-center transition-all duration-300 ${
                  opcionSeleccionada === opcion.id
                    ? 'bg-white/20 ring-2 ring-white'
                    : 'bg-white/10 hover:bg-white/15'
                } ${
                  codigoPromoValido && opcion.id !== codigoPromoValido.opcionSeguroId
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">{opcion.nombre}</h3>
                <p className="text-gray-300 mb-4">{opcion.descripcion}</p>
                <p className="text-white mb-2">
                  Cobertura: ${formatNumber(opcion.valorCobertura)}
                </p>
                <p className="text-white">
                  Prima: ${formatNumber(
                    codigoPromoValido && opcion.id === codigoPromoValido.opcionSeguroId
                      ? opcion.valorPrima * (1 - codigoPromoValido.descuento)
                      : opcion.valorPrima
                  )}
                </p>
              </button>
            ))}
          </div>

          {/* Fecha y Hora */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-white mb-2">Fecha de Inicio</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementarFecha}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                  disabled={new Date(`${fechaInicio}T${horaInicio}`) <= new Date()}
                >
                  -
                </button>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => handleFechaHoraInicioChange(e.target.value, horaInicio)}
                  min={new Date().toISOString().split('T')[0]}
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={incrementarFecha}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Hora de Inicio</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementarHora}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                  disabled={new Date(`${fechaInicio}T${horaInicio}`) <= new Date()}
                >
                  -
                </button>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => handleFechaHoraInicioChange(fechaInicio, e.target.value)}
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={incrementarHora}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Fecha y Hora de Finalización</label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={fechaFin}
                  disabled
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg"
                />
                <input
                  type="time"
                  value={horaFin}
                  disabled
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Botón de Activar */}
          <div className="text-center">
            <button
              onClick={activarSeguro}
              disabled={!opcionSeleccionada}
              className="bg-green-500/80 hover:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Activar Seguro
            </button>
          </div>

          {/* Link a Términos y Condiciones */}
          <div className="text-center mt-6">
            <Link
              href="/terminos"
              target="_blank"
              className="text-white/80 hover:text-white underline"
            >
              Términos y condiciones de la póliza
            </Link>
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