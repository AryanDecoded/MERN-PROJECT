import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app, exposes current user + auth actions.
 * Token storage and API calls are stubbed; wire up to server/routes/auth.js
 * once the backend exists.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: check for existing token (e.g. in memory / httpOnly cookie)
    // and validate against the server, then setUser(...)
    setLoading(false);
  }, []);

  async function login(email, password) {
    // TODO: POST /api/auth/login -> receive JWT -> setUser
    console.log('login', email, password);
  }

  async function register(name, email, password) {
    // TODO: POST /api/auth/register
    console.log('register', name, email, password);
  }

  function logout() {
    // TODO: clear token / call /api/auth/logout
    setUser(null);
  }

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
