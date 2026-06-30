import { useEffect, useState } from 'react';
import { spendingAPI } from '../api/api';
import styles from './Spending.module.css';

export default function Spending() {
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMsg, setInviteMsg] = useState('');

  useEffect(() => {
    spendingAPI.getBreakdown()
      .then(setBreakdown)
      .finally(() => setLoading(false));
  }, []);

  async function handleExport() {
    try {
      const res = await spendingAPI.exportCSV();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spending.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  }

  async function handleInvite(e) {
    e.preventDefault();
    try {
      const data = await spendingAPI.invite(inviteEmail);
      setInviteMsg(data.message);
      setInviteEmail('');
    } catch (err) {
      setInviteMsg('Error: ' + err.message);
    }
  }

  const total = breakdown.reduce((sum, m) => sum + m.total, 0);

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Spending</h1>
          <p className={styles.subtitle}>This month's breakdown by member</p>
        </div>
        <button type="button" className={styles.exportBtn} onClick={handleExport}>
          Export CSV
        </button>
      </header>

      <div className={styles.totalCard}>
        <p className={styles.totalLabel}>Total this month</p>
        <p className={styles.totalValue}>₹{total.toLocaleString('en-IN')}</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>By member</h2>
        <div className={styles.members}>
          {breakdown.map((m) => (
            <div key={m.memberId} className={styles.memberRow}>
              <span className={styles.memberName}>{m.name}</span>
              <span className={styles.memberAmount}>₹{m.total.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Invite a household member</h2>
        <form className={styles.inviteForm} onSubmit={handleInvite}>
          <input type="email" placeholder="their@email.com" value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)} className={styles.inviteInput} required />
          <button type="submit" className={styles.inviteBtn}>Invite</button>
        </form>
        {inviteMsg && <p style={{ marginTop: '0.5rem', color: '#2d6a4f' }}>{inviteMsg}</p>}
      </section>
    </div>
  );
}
