import { useEffect, useState } from 'react';
import ShoppingList from '../components/ShoppingList';
import { shoppingAPI } from '../api/api';
import styles from './Shopping.module.css';

export default function Shopping() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    shoppingAPI.getAll()
      .then((data) => setItems(data.map((i) => ({ ...i, id: i._id }))))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(target) {
    // Optimistically update UI
    setItems((prev) => prev.map((i) => i.id === target.id ? { ...i, isChecked: true } : i));
    try {
      await shoppingAPI.checkOff(target.id);
    } catch {
      // Revert on failure
      setItems((prev) => prev.map((i) => i.id === target.id ? { ...i, isChecked: false } : i));
    }
  }

  async function handleAddManual(e) {
    e.preventDefault();
    if (!newItem.trim()) return;
    const item = await shoppingAPI.add({ name: newItem.trim(), quantity: 1, unit: 'pcs' });
    setItems((prev) => [...prev, { ...item.item, id: item.item._id }]);
    setNewItem('');
  }

  const pending = items.filter((i) => !i.isChecked);

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Shopping List</h1>
        <p className={styles.subtitle}>{pending.length} item{pending.length === 1 ? '' : 's'} to buy</p>
      </header>

      {/* Manual add form */}
      <form className={styles.addForm} onSubmit={handleAddManual}>
        <input type="text" placeholder="Add an item manually…" value={newItem}
          onChange={(e) => setNewItem(e.target.value)} className={styles.addInput} />
        <button type="submit" className={styles.addBtn}>Add</button>
      </form>

      <ShoppingList
        items={items.map((i) => ({ ...i, checked: i.isChecked }))}
        onToggle={handleToggle}
      />
    </div>
  );
}
