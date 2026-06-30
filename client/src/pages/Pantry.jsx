import { useEffect, useMemo, useState } from 'react';
import PantryItem from '../components/PantryItem';
import { pantryAPI } from '../api/api';
import styles from './Pantry.module.css';

const CATEGORIES = ['All', 'Dairy', 'Bakery', 'Grains', 'Produce', 'Spices', 'Meat', 'Beverages', 'Snacks', 'Other'];

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    pantryAPI.getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(item) {
    if (!window.confirm(`Remove ${item.name}?`)) return;
    await pantryAPI.remove(item._id);
    setItems((prev) => prev.filter((i) => i._id !== item._id));
  }

  function handleEdit(item) {
    setEditingItem(item._id);
      setEditForm({
        name:     item.name,
        quantity: item.quantity,
        unit:     item.unit,
        category: item.category,
    });
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchQuery = item.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === 'All' || item.category === category;
      return matchQuery && matchCat;
    });
  }, [items, query, category]);

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Pantry</h1>
      </header>

      <div className={styles.controls}>
        <input type="text" placeholder="Search items…" value={query}
          onChange={(e) => setQuery(e.target.value)} className={styles.search} />
        <div className={styles.chips}>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No items found.</p>
        ) : (
          filtered.map((item) => (
            <PantryItem key={item._id} item={item} onDelete={handleDelete} onEdit={handleEdit} />
          ))
        )}
      </div>
    </div>
  );
}
