import { useMemo, useState } from 'react';
import PantryItem from '../components/PantryItem';
import styles from './Pantry.module.css';

const sampleItems = [
  { id: 1, name: 'Curd', quantity: 1, unit: 'cup', category: 'Dairy', expiryDate: daysFromNow(-1) },
  { id: 2, name: 'Bread', quantity: 0.5, unit: 'loaf', category: 'Bakery', expiryDate: daysFromNow(2) },
  { id: 3, name: 'Milk', quantity: 500, unit: 'ml', category: 'Dairy', expiryDate: daysFromNow(3) },
  { id: 4, name: 'Rice', quantity: 2, unit: 'kg', category: 'Grains', expiryDate: daysFromNow(120) },
  { id: 5, name: 'Onions', quantity: 1.2, unit: 'kg', category: 'Produce', expiryDate: daysFromNow(30) },
  { id: 6, name: 'Tomatoes', quantity: 500, unit: 'g', category: 'Produce', expiryDate: daysFromNow(5) },
];

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

const CATEGORIES = ['All', 'Dairy', 'Bakery', 'Grains', 'Produce'];

export default function Pantry() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return sampleItems.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Pantry</h1>
        <button type="button" className={styles.addBtn}>
          + Add item
        </button>
      </header>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search items…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.search}
        />
        <div className={styles.chips}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No items match your search.</p>
        ) : (
          filtered.map((item) => <PantryItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
