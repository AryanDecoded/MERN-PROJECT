import { useState } from 'react';
import ShoppingList from '../components/ShoppingList';
import styles from './Shopping.module.css';

const sampleItems = [
  { id: 1, name: 'Eggs', quantity: 12, unit: 'pcs', checked: true },
  { id: 2, name: 'Milk', quantity: 1, unit: 'L', checked: false },
  { id: 3, name: 'Tomatoes', quantity: 500, unit: 'g', checked: false },
  { id: 4, name: 'Bread', quantity: 1, unit: 'loaf', checked: false },
  { id: 5, name: 'Curd', quantity: 400, unit: 'g', checked: false },
];

export default function Shopping() {
  const [items, setItems] = useState(sampleItems);

  function handleToggle(target) {
    setItems((prev) =>
      prev.map((i) => (i.id === target.id ? { ...i, checked: !i.checked } : i))
    );
    // TODO: PATCH /api/shopping/:id once server route exists
    // Checking off should also update pantry quantity (atomic update per plan)
  }

  const remaining = items.filter((i) => !i.checked).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Shopping List</h1>
        <p className={styles.subtitle}>{remaining} item{remaining === 1 ? '' : 's'} today</p>
      </header>

      <ShoppingList items={items} onToggle={handleToggle} />
    </div>
  );
}
