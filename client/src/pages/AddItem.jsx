import { useState } from 'react';
import styles from './AddItem.module.css';

const UNITS = ['kg', 'g', 'L', 'ml', 'pcs'];
const CATEGORIES = ['Dairy', 'Bakery', 'Grains', 'Produce', 'Spices', 'Other'];

export default function AddItem() {
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    unit: 'pcs',
    category: 'Other',
    purchaseDate: '',
    expiryDate: '',
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST to /api/pantry once server route exists
    console.log('New item:', form);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Add item</h1>
        <p className={styles.subtitle}>Log a new item to your pantry shelf.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Field label="Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Basmati rice"
            required
          />
        </Field>

        <div className={styles.row}>
          <Field label="Quantity">
            <input
              type="number"
              min="0"
              step="any"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              placeholder="0"
              required
            />
          </Field>

          <Field label="Unit">
            <select value={form.unit} onChange={(e) => update('unit', e.target.value)}>
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Category">
          <select value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <div className={styles.row}>
          <Field label="Purchase date">
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => update('purchaseDate', e.target.value)}
            />
          </Field>

          <Field label="Expiry date">
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => update('expiryDate', e.target.value)}
            />
          </Field>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Add to pantry
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  );
}
