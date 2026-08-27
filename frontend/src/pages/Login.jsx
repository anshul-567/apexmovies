import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fromPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <form className="card" style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.title}>Log in to <span className="text-gradient">ApexMovies</span></h1>
        {error && <div style={styles.error}>{error}</div>}
        <label style={styles.label}>Email</label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label style={styles.label}>Password</label>
        <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary" style={{ marginTop: 20 }} disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
        <p style={styles.footer}>New here? <Link to="/register" style={{ color: 'var(--color-cyan)' }}>Create an account</Link></p>
      </form>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', padding: '80px 24px' },
  form: { padding: 36, width: 380, display: 'flex', flexDirection: 'column' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 24 },
  label: { fontSize: 13, color: 'var(--color-text-secondary)', margin: '14px 0 6px' },
  error: { background: 'rgba(255,92,122,0.12)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  footer: { fontSize: 13, color: 'var(--color-text-muted)', marginTop: 20, textAlign: 'center' },
};
