import { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../lib/pb.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(pb.authStore.record);

  useEffect(() => {
    const unsub = pb.authStore.onChange((token, model) => {
      setUser(model);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('members').authRefresh().catch(() => pb.authStore.clear());
    }
  }, []);

  const logout = () => pb.authStore.clear();

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
