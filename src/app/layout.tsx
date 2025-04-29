'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useEffect, useState, createContext, useContext } from 'react';
import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const inter = Inter({ subsets: ['latin'] });

// Firebase Context
type FirebaseContextType = {
  auth: Auth;
  db: Firestore;
  user: User | null;
  initialized: boolean;
  error: Error | null;
};

const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  db,
  user: null,
  initialized: false,
  error: null,
});

export function useFirebase() {
  return useContext(FirebaseContext);
}

function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, db, user, initialized, error }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}