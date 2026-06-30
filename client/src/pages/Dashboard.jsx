import { useEffect, useState } from 'react';
import PantryItem from '../components/PantryItem';
import { pantryAPI } from '../api/api';
import styles from './Dashboard.module.css';

export default function Dashboard({goToPantry}) {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({ total: 0, expiringSoon: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [itemsData, summaryData] = await Promise.all([
          pantryAPI.getAll(),
          pantryAPI.getSummary(),
        ]);
        setItems(itemsData);
        setSummary(summaryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (error)   return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Pantry</h1>
        <p className={styles.subtitle}>Here's what's on your shelves today.</p>
      </header>

      <div className={styles.stats}>
        <StatCard label="Total items"  value={summary.total}       />
        <StatCard label="Expiring"     value={summary.expiringSoon} tone="soon"    />
        <StatCard label="Expired"      value={summary.expired}      tone="expired" />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>At a glance</h2>
        <div className={styles.list}>
          {items.length === 0 ? (
            <p className={styles.empty}>No items yet. Add something to your pantry!</p>
          ) : (
            items.map((item) => <PantryItem key={item._id} item={item} onEdit={goToPantry} onDelete={goToPantry} />)
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`${styles.statCard} ${tone ? styles[`tone-${tone}`] : ''}`}>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}
