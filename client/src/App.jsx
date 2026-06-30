import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotificationBell from './components/NotificationBell';
import Dashboard from './pages/Dashboard';
import Pantry from './pages/Pantry';
import AddItem from './pages/AddItem';
import Shopping from './pages/Shopping';
import Recipes from './pages/Recipes';
import Spending from './pages/Spending';
import Auth from './pages/Auth';
import styles from './App.module.css';

const PAGES = {
  dashboard: { label: 'Dashboard', component: Dashboard },
  pantry:    { label: 'Pantry',    component: Pantry    },
  add:       { label: 'Add Item',  component: AddItem   },
  shopping:  { label: 'Shopping',  component: Shopping  },
  recipes:   { label: 'Recipes',   component: Recipes   },
  spending:  { label: 'Spending',  component: Spending  },
};

function AppShell() {
  const { user, loading, logout } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  // Show login/register if no user
  if (!user) return <Auth />;

  const ActiveComponent = PAGES[activePage].component;

  return (
    <div className={styles.app}>
      <nav className={styles.navbar}>
        <span className={styles.brand}>🌿 Pantry Tracker</span>

        <div className={styles.navLinks}>
          {Object.entries(PAGES).map(([key, { label }]) => (
            <button key={key} type="button"
              className={`${styles.navLink} ${activePage === key ? styles.navLinkActive : ''}`}
              onClick={() => setActivePage(key)}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <NotificationBell notifications={[]} />
          <button type="button" onClick={logout}
            style={{ fontSize: '0.8rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <ActiveComponent goToPantry={() => setActivePage('pantry')} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
