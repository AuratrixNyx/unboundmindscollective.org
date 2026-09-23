import { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../lib/pb.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(pb.authStore.record);

  // Keep user state in sync whenever the authStore changes
  useEffect(() => {
    const unsub = pb.authStore.onChange((token, model) => {
      setUser(model);
    });
    return unsub;
  }, []);

  // On mount, refresh the auth token and re-fetch the full member record
  // so profile fields (display_name, bio, etc.) are always up to date
  useEffect(() => {
    if (pb.authStore.isValid) {
      pb.collection('members')
        .authRefresh()
        .then(() => {
          // authRefresh updates authStore.record — pull the latest
          setUser({ ...pb.authStore.record });
        })
        .catch(() => pb.authStore.clear());
    }
  }, []);

  // refreshUser — call this after saving profile changes so the nav/profile
  // reflect the new values immediately without a page reload
  const refreshUser = async () => {
    if (!pb.authStore.isValid) return;
    try {
      const fresh = await pb.collection('members').getOne(pb.authStore.record.id);
      setUser(fresh);
    } catch {
      // silent — stale data is better than crashing
    }
  };

  const logout = () => pb.authStore.clear();

  return (
    <AuthContext.Provider value={{ user, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
