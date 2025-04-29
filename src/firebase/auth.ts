import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, Firestore } from 'firebase/firestore';

interface UserData {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  celular: string;
  pin: string;
  saldo?: number;
  verificado?: boolean;
  auth?: Auth;
  db?: Firestore;
}

// Función para verificar si existe un usuario con los datos proporcionados
const checkExistingUser = async (db: Firestore, userData: UserData) => {
  try {
    const usersRef = collection(db, 'usuarios');
    
    // Verificar documento
    const docQuery = query(usersRef, where('numeroDocumento', '==', userData.numeroDocumento));
    const docSnapshot = await getDocs(docQuery);
    if (!docSnapshot.empty) {
      return {
        exists: true,
        field: 'documento',
        message: 'Ya existe un usuario registrado con este número de documento'
      };
    }

    // Verificar email
    const emailQuery = query(usersRef, where('email', '==', userData.email));
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      return {
        exists: true,
        field: 'email',
        message: 'Ya existe un usuario registrado con este correo electrónico'
      };
    }

    // Verificar celular
    const celularQuery = query(usersRef, where('celular', '==', userData.celular));
    const celularSnapshot = await getDocs(celularQuery);
    if (!celularSnapshot.empty) {
      return {
        exists: true,
        field: 'celular',
        message: 'Ya existe un usuario registrado con este número de celular'
      };
    }

    return { exists: false };
  } catch (error) {
    console.error('Error verificando usuario existente:', error);
    throw new Error('Error al verificar el usuario');
  }
};

export const registerUser = async (userData: UserData) => {
  const { auth, db } = userData;
  
  if (!auth || !db) {
    throw new Error('Firebase no está inicializado');
  }

  try {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { 
        success: false, 
        error: 'Por favor ingresa un correo electrónico válido' 
      };
    }

    // Verificar si existe un usuario con los datos proporcionados
    const existingUser = await checkExistingUser(db, userData);
    if (existingUser.exists) {
      return {
        success: false,
        error: existingUser.message,
        field: existingUser.field
      };
    }

    // Crear una contraseña segura basada en el PIN
    const securePassword = `Acgura${userData.pin}2024!`;

    // Crear usuario en Authentication usando email y contraseña segura
    const authResult = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      securePassword
    );

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'usuarios', authResult.user.uid), {
      nombre: userData.nombreCompleto,
      tipoDocumento: userData.tipoDocumento,
      numeroDocumento: userData.numeroDocumento,
      celular: userData.celular,
      email: userData.email,
      pin: userData.pin,
      saldo: 0, // 
      verificado: userData.verificado || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, userId: authResult.user.uid };
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    let errorMessage = 'Error al registrar usuario';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este correo electrónico ya está registrado. Por favor, intenta iniciar sesión o usa un correo diferente.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'El correo electrónico no es válido';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Error al crear la cuenta. Por favor intenta de nuevo.';
    }

    return { 
      success: false, 
      error: errorMessage
    };
  }
};

export const loginUser = async (auth: Auth | null, db: Firestore | null, tipoDocumento: string, numeroDocumento: string, pin: string) => {
  if (!auth || !db) {
    throw new Error('Firebase no está inicializado');
  }

  try {
    // Buscar el usuario por tipo y número de documento
    const usersRef = collection(db, 'usuarios');
    const q = query(
      usersRef, 
      where('tipoDocumento', '==', tipoDocumento),
      where('numeroDocumento', '==', numeroDocumento)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { 
        success: false, 
        error: 'Usuario no encontrado. Por favor, verifica tus datos o regístrate.',
        shouldRedirectToRegister: true
      };
    }

    const userData = querySnapshot.docs[0].data();
    
    // Verificar si el PIN coincide
    if (userData.pin !== pin) {
      return { 
        success: false, 
        error: 'PIN incorrecto. Por favor, intenta de nuevo.',
        shouldShowForgotPin: true
      };
    }

    // Crear la contraseña segura basada en el PIN
    const securePassword = `Acgura${pin}2024!`;

    // Intentar login con email y contraseña segura
    const authResult = await signInWithEmailAndPassword(
      auth,
      userData.email,
      securePassword
    );

    // Obtener datos completos del usuario
    const userDoc = await getDoc(doc(db, 'usuarios', authResult.user.uid));
    const userFullData = userDoc.data();

    return { 
      success: true, 
      user: {
        ...userFullData,
        id: authResult.user.uid
      }
    };
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    let errorMessage = 'Error al iniciar sesión';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuario no encontrado';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'PIN incorrecto';
    }

    return { 
      success: false, 
      error: errorMessage
    };
  }
};

export const logoutUser = async (auth: Auth | null) => {
  if (!auth) {
    throw new Error('Firebase no está inicializado');
  }

  try {
    await signOut(auth);
    localStorage.removeItem('userData');
  } catch (error: any) {
    console.error('Error en logout:', error);
    throw new Error('Hubo un problema al cerrar sesión. Por favor, intenta nuevamente.');
  }
};

export const getUserByCedula = async (db: Firestore | null, cedula: string) => {
  if (!db) {
    throw new Error('Firebase no está inicializado');
  }

  try {
    const usersRef = collection(db, 'usuarios');
    const q = query(usersRef, where('numeroDocumento', '==', cedula));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const userData = querySnapshot.docs[0].data();
    return userData;
  } catch (error) {
    console.error('Error obteniendo usuario por cédula:', error);
    throw new Error('Error al verificar el usuario. Por favor, intenta nuevamente.');
  }
};