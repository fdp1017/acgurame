import { auth, db } from './config';
import { 
  signInWithEmailAndPassword,
  signOut,
  UserCredential 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

// Interfaz para el usuario
export interface User {
  cedula: string;
  email: string;
  pin: string;
  nombre?: string;
  apellido?: string;
  rol?: string;
}

// Función para registrar un usuario
export const registerUser = async (userData: User): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verificar si el usuario ya existe por cédula
    const userQuery = query(collection(db, 'users'), where('cedula', '==', userData.cedula));
    const userDocs = await getDocs(userQuery);
    
    if (!userDocs.empty) {
      return { success: false, error: 'Ya existe un usuario con esta cédula' };
    }

    // Crear el email basado en la cédula
    const email = `${userData.cedula}@acgurame.com`;
    
    // Guardar los datos del usuario en Firestore
    await setDoc(doc(db, 'users', userData.cedula), {
      ...userData,
      email,
      createdAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { 
      success: false, 
      error: 'Error al registrar usuario. Por favor, intenta de nuevo.' 
    };
  }
};

// Función para iniciar sesión
export const loginUser = async (cedula: string, pin: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Buscar el usuario por cédula
    const userDoc = await getDoc(doc(db, 'users', cedula));
    
    if (!userDoc.exists()) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const userData = userDoc.data() as User;
    const email = `${cedula}@acgurame.com`;

    // Intentar iniciar sesión
    if (userData.pin !== pin) {
      return { success: false, error: 'PIN incorrecto' };
    }

    await signInWithEmailAndPassword(auth, email, pin);
    return { success: true };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { 
      success: false, 
      error: 'Error al iniciar sesión. Por favor, intenta de nuevo.' 
    };
  }
};

// Función para cerrar sesión
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { 
      success: false, 
      error: 'Error al cerrar sesión. Por favor, intenta de nuevo.' 
    };
  }
};

// Función para obtener usuario por cédula
export const getUserByCedula = async (cedula: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', cedula));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};