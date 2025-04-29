'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

type FirebaseContextType = {
  auth: Auth | null;
  db: Firestore | null;
  user: User | null;
  initialized: boolean;
  error: Error | null;
};

const FirebaseContext = createContext<FirebaseContextType>({
  auth: auth ?? null,
  db: db ?? null,
  user: null,
  initialized: false,
  error: null,
});

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) return;
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