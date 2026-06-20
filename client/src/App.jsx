import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import NotificationBell from './components/NotificationBell';
import Dashboard from './pages/Dashboard';
import Pantry from './pages/Pantry';
import AddItem from './pages/AddItem';
import Shopping from './pages/Shopping';
import Recipes from './pages/Recipes';
import Spending from './pages/Spending';
import styles from './App.module.css';

// Temporary in-memory nav until react-router-dom is added.
const PAGES = {
  dashboard: { label: 'Dashboard', component: Dashboard },
  pantry: { label: 'Pantry', component: Pantry },
  add: { label: 'Add Item', component: AddItem },
  shopping: { label: 'Shopping', component: Shopping },
  recipes: { label: 'Recipes', component: Recipes },
  spending: { label: 'Spending', component: Spending },
};

const sampleNotifications = [
  { id: 1, message: 'Curd expired', type: 'expired' },
  { id: 2, message: 'Bread expires in 2 days', type: 'soon' },
  { id: 3, message: 'Milk expires in 3 days', type: 'soon' },
];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const ActiveComponent = PAGES[activePage].component;

  return (
    <AuthProvider>
      <div className={styles.app}>
        <nav className={styles.navbar}>
          <span className={styles.brand}>🌿 Pantry Tracker</span>

          <div className={styles.navLinks}>
            {Object.entries(PAGES).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                className={`${styles.navLink} ${activePage === key ? styles.navLinkActive : ''}`}
                onClick={() => setActivePage(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <NotificationBell notifications={sampleNotifications} />
        </nav>

        <main className={styles.main}>
          <ActiveComponent />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
