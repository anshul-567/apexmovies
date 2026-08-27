import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <form className="card" style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Create your <span className="text-gradient">ApexMovies</span> account</h1>
        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Full name</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label style={styles.label}>Email</label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label style={styles.label}>Password</label>
        <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <label style={styles.label}>Account type</label>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="customer">Customer — book tickets</option>
          <option value="theater_admin">Theater admin — manage movies and shows</option>
        </select>

        <button className="btn-primary" style={{ marginTop: 20 }} disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
        <p style={styles.footer}>Already have an account? <Link to="/login" style={{ color: 'var(--color-cyan)' }}>Log in</Link></p>
      </form>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', padding: '80px 24px' },
  form: { padding: 36, width: 400, display: 'flex', flexDirection: 'column' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 24, lineHeight: 1.4 },
  label: { fontSize: 13, color: 'var(--color-text-secondary)', margin: '14px 0 6px' },
  error: { background: 'rgba(255,92,122,0.12)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  footer: { fontSize: 13, color: 'var(--color-text-muted)', marginTop: 20, textAlign: 'center' },
};
