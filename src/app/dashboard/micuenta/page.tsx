'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth, db } from '../../../firebase/config';
import { doc, updateDoc, onSnapshot, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { IoArrowBack } from 'react-icons/io5';

interface UserData {
  nombre: string;
  email: string;
  celular: string;
  tipoDocumento: string;
  numeroDocumento: string;
  balance: number;
}

interface Poliza {
  id: string;
  numeroPoliza: string;
  fechaInicio: string;
  fechaFin: string;
  valorCobertura: number;
  estado: 'Activa' | 'Inactiva' | 'Reclamada' | 'Cerrada';
  estadoCierre?: 'A' | 'R';
}

interface PasswordData {
  newPassword: string;
  confirmPassword: string;
}

export default function MiCuenta() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [montoOperacion, setMontoOperacion] = useState('');
  const [seccionActiva, setSeccionActiva] = useState<'inicio' | 'perfil' | 'polizas'>('inicio');
  const [perfilData, setPerfilData] = useState<UserData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordData, setPasswordData] = useState<PasswordData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/login');
          return;
        }

        // Escuchar cambios en los datos del usuario en tiempo real
        const unsubscribe = onSnapshot(doc(db, 'usuarios', user.uid), (doc) => {
          if (doc.exists()) {
            const data = doc.data() as UserData;
            setUserData(data);
            setPerfilData(data);
          }
          setLoading(false);
        });

        // Cargar pólizas
        await cargarPolizas(user.uid);

        return () => unsubscribe();
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const cargarPolizas = async (userId: string) => {
    try {
      const polizasRef = collection(db, 'seguros');
      const q = query(
        polizasRef,
        where('userId', '==', userId),
        orderBy('fechaInicio', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const polizasData: Poliza[] = [];
      const ahora = new Date();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fechaInicio = new Date(data.fechaInicio);
        const fechaFin = new Date(data.fechaFin);
        const treintaDiasDespues = new Date(fechaFin.getTime() + (30 * 24 * 60 * 60 * 1000));

        let estado: 'Activa' | 'Inactiva' | 'Reclamada' | 'Cerrada';
        
        if (data.reclamada) {
          estado = 'Reclamada';
        } else if (ahora > treintaDiasDespues) {
          estado = 'Cerrada';
        } else if (ahora >= fechaInicio && ahora <= fechaFin) {
          estado = 'Activa';
        } else {
          estado = 'Inactiva';
        }

        polizasData.push({
          id: doc.id,
          numeroPoliza: data.numeroPoliza || '',
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          valorCobertura: data.valorCobertura,
          estado: estado,
          estadoCierre: data.estadoCierre
        });
      });
      
      setPolizas(polizasData);
    } catch (error) {
      console.error('Error al cargar pólizas:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordError('');
      setPasswordSuccess('');

      const user = auth.currentUser;
      if (!user) {
        setPasswordError('Usuario no autenticado');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      await updatePassword(user, passwordData.newPassword);
      
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess('Contraseña actualizada exitosamente');
      
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);

    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);
      setPasswordError('Error al actualizar la contraseña. Por favor, inicie sesión nuevamente e intente de nuevo.');
    }
  };  const handleDeposito = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !userData) return;

      const monto = parseFloat(montoOperacion);
      if (isNaN(monto) || monto <= 0) {
        setErrorMessage('Por favor ingrese un monto válido');
        return;
      }

      const nuevoBalance = (userData.balance || 0) + monto;
      await updateDoc(doc(db, 'usuarios', user.uid), {
        balance: nuevoBalance
      });

      setMontoOperacion('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error al depositar:', error);
      setErrorMessage('Error al procesar el depósito');
    }
  };
  const handleRetiro = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !userData) return;

      const monto = parseFloat(montoOperacion);
      if (isNaN(monto) || monto <= 0) {
        setErrorMessage('Por favor ingrese un monto válido');
        return;
      }

      if (monto > (userData.balance || 0)) {
        setErrorMessage('Saldo insuficiente');
        return;
      }

      const nuevoBalance = (userData.balance || 0) - monto;
      await updateDoc(doc(db, 'usuarios', user.uid), {
        balance: nuevoBalance
      });

      setMontoOperacion('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error al retirar:', error);
      setErrorMessage('Error al procesar el retiro');
    }
  };

  const handleUpdatePerfil = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !perfilData) return;
      const updateData = {
        nombre: perfilData.nombre,
        email: perfilData.email,
        celular: perfilData.celular,
        tipoDocumento: perfilData.tipoDocumento,
        numeroDocumento: perfilData.numeroDocumento
      };
      await updateDoc(doc(db, 'usuarios', user.uid), updateData);
      setSeccionActiva('inicio');
      setErrorMessage('');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setErrorMessage('Error al actualizar el perfil');
    }
  };

  const formatNumber = (number: number) => {
    return number?.toLocaleString('es-CO') || '0';
  };

  const handleReclamar = (polizaId: string) => {
    router.push('/dashboard/reclamar');
  };

  const mostrarBotonReclamar = (poliza: Poliza) => {
    const ahora = new Date();
    const fechaFin = new Date(poliza.fechaFin);
    const treintaDiasDespues = new Date(fechaFin.getTime() + (30 * 24 * 60 * 60 * 1000));

    return (
      (poliza.estado === 'Activa' || 
       (poliza.estado === 'Inactiva' && ahora <= treintaDiasDespues)) &&
       !['Reclamada', 'Cerrada'].includes(poliza.estado)
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
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
        <div className="max-w-2xl mx-auto">
          {seccionActiva === 'inicio' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Mi Cuenta</h2>
                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-8 py-4">
                  <p className="text-white text-xl">
                    Saldo disponible: <span className="font-bold">${formatNumber(userData?.balance || 0)}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {errorMessage && (
                  <div className="bg-red-500/80 text-white p-3 rounded-lg text-center">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDeposito}
                    className="bg-green-500/80 hover:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300"
                  >
                    Depositar
                  </button>
                  <button
                    onClick={handleRetiro}
                    className="bg-blue-500/80 hover:bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300"
                  >
                    Retirar
                  </button>
                </div>

                <div className="max-w-xs mx-auto">
                  <input
                    type="number"
                    value={montoOperacion}
                    onChange={(e) => setMontoOperacion(e.target.value)}
                    placeholder="Ingrese el monto"
                    className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSeccionActiva('perfil')}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-all duration-300"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => setSeccionActiva('polizas')}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-all duration-300"
                  >
                    Mis Pólizas
                  </button>
                </div>
              </div>
            </>
          )}

          {seccionActiva === 'polizas' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 overflow-x-auto">
              <h3 className="text-2xl font-bold text-white mb-6">Mis Pólizas</h3>
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-4 py-2 text-left">Número</th>
                    <th className="px-4 py-2 text-left">Inicio</th>
                    <th className="px-4 py-2 text-left">Fin</th>
                    <th className="px-4 py-2 text-right">Valor Asegurado</th>
                    <th className="px-4 py-2 text-center">Estado</th>
                    <th className="px-4 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {polizas.map((poliza) => (
                    <tr key={poliza.id} className="border-b border-white/10">
                      <td className="px-4 py-2">{poliza.numeroPoliza}</td>
                      <td className="px-4 py-2">
                        {new Date(poliza.fechaInicio).toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(poliza.fechaFin).toLocaleString('es-CO')}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ${formatNumber(poliza.valorCobertura)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          poliza.estado === 'Activa' ? 'bg-green-500/20 text-green-400' :
                          poliza.estado === 'Inactiva' ? 'bg-yellow-500/20 text-yellow-400' :
                          poliza.estado === 'Reclamada' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {poliza.estado}
                          {poliza.estado === 'Cerrada' && poliza.estadoCierre && ` (${poliza.estadoCierre})`}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {mostrarBotonReclamar(poliza) && (
                          <button
                            onClick={() => handleReclamar(poliza.id)}
                            className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-1 rounded text-sm transition-all duration-300"
                          >
                            Reclamar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setSeccionActiva('inicio')}
                className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-all duration-300"
              >
                Volver
              </button>
            </div>
          )}

          {seccionActiva === 'perfil' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Mi Perfil</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={perfilData?.nombre || ''}
                    onChange={(e) => setPerfilData(prev => ({ ...prev!, nombre: e.target.value }))}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={perfilData?.email || ''}
                    onChange={(e) => setPerfilData(prev => ({ ...prev!, email: e.target.value }))}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Celular</label>
                  <input
                    type="tel"
                    value={perfilData?.celular || ''}
                    onChange={(e) => setPerfilData(prev => ({ ...prev!, celular: e.target.value }))}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Tipo de Documento</label>
                  <select
                    value={perfilData?.tipoDocumento || ''}
                    onChange={(e) => setPerfilData(prev => ({ ...prev!, tipoDocumento: e.target.value }))}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PA">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2">Número de Documento</label>
                  <input
                    type="text"
                    value={perfilData?.numeroDocumento || ''}
                    onChange={(e) => setPerfilData(prev => ({ ...prev!, numeroDocumento: e.target.value }))}
                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>

                {/* Sección de Cambio de Contraseña */}
                <div className="border-t border-white/20 mt-8 pt-8">
                  <h4 className="text-xl font-semibold text-white mb-4">Cambiar Contraseña</h4>
                  
             s     {passwordError && (
                    <div className="bg-red-500/80 text-white p-3 rounded-lg text-center mb-4">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="bg-green-500/80 text-white p-3 rounded-lg text-center mb-4">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Nueva Contraseña</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="Ingrese su nueva contraseña"
                      />
                    </div>

                    <div>
                      <label className="block text-white mb-2">Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full bg-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="Confirme su nueva contraseña"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      className="w-full bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      Actualizar Contraseña
                    </button>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-6">
                  <button
                    onClick={handleUpdatePerfil}
                    className="bg-green-500/80 hover:bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setSeccionActiva('inicio')}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-lg transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-12">
          ACgura © - Una marca registrada de DataPaga® 2023 - Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}