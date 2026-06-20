import PantryItem from '../components/PantryItem';
import styles from './Dashboard.module.css';

// Sample data — replace with API call once server routes exist
const sampleItems = [
  { id: 1, name: 'Curd', quantity: 1, unit: 'cup', category: 'Dairy', expiryDate: daysFromNow(-1) },
  { id: 2, name: 'Bread', quantity: 0.5, unit: 'loaf', category: 'Bakery', expiryDate: daysFromNow(2) },
  { id: 3, name: 'Milk', quantity: 500, unit: 'ml', category: 'Dairy', expiryDate: daysFromNow(3) },
  { id: 4, name: 'Rice', quantity: 2, unit: 'kg', category: 'Grains', expiryDate: daysFromNow(120) },
  { id: 5, name: 'Onions', quantity: 1.2, unit: 'kg', category: 'Produce', expiryDate: daysFromNow(30) },
];

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export default function Dashboard() {
  const total = sampleItems.length;
  const expired = sampleItems.filter((i) => new Date(i.expiryDate) < new Date()).length;
  const expiringSoon = sampleItems.filter((i) => {
    const days = Math.round((new Date(i.expiryDate) - new Date()) / 86400000);
    return days >= 0 && days <= 3;
  }).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Pantry</h1>
        <p className={styles.subtitle}>Here's what's on your shelves today.</p>
      </header>

      <div className={styles.stats}>
        <StatCard label="Total items" value={total} />
        <StatCard label="Expiring" value={expiringSoon} tone="soon" />
        <StatCard label="Expired" value={expired} tone="expired" />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>At a glance</h2>
        <div className={styles.list}>
          {sampleItems.map((item) => (
            <PantryItem key={item.id} item={item} />
          ))}
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
