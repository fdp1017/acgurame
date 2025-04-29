import { initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCYVMXvukfvzqvqTTqnpmNntfpq8-x8TXA",
  authDomain: "acgura-app.firebaseapp.com",
  projectId: "acgura-app",
  storageBucket: "acgura-app.firebasestorage.app",
  messagingSenderId: "822857435433",
  appId: "1:822857435433:web:d66c489aa7294780ba0f38",
  measurementId: "G-TWEDEW30QQ"
};

// Verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

// Inicializar Firebase solo en el cliente
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isClient) {
  try {
    // Inicializar la app solo si no hay instancias previas
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    
    // Inicializar servicios
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Error inicializando Firebase:', error);
  }
}

export { auth, db };