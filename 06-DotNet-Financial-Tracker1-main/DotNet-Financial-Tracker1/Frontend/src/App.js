
import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';
import ConfiguracionSeguridad from './ConfiguracionSeguridad';
import
{

  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  PlusCircle,
  LayoutDashboard,
  History,
  Pencil,
  X,
  Trash2,
  Menu,
  ShieldCheck,
} from 'lucide-react';

const API_URL = 'http://localhost:5138/api/transactions';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tt-title">{label}</div>
      <div className="tt-value">Monto: {Number(payload[0].value).toLocaleString()}</div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Ingreso');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  async function fetchTransactions() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`No se pudieron cargar las transacciones (HTTP ${res.status}).`);
      }
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('API error', err);
      setError('No se pudo conectar con el backend. Comprueba que esté ejecutándose.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Ingresa una descripción y un monto mayor que cero.');
      return;
    }
    const payload = { description: description.trim(), amount: parsedAmount, type, date: new Date().toISOString() };
    try {
      setLoading(true);
      setError('');
      const res = await fetch(editingId === null ? API_URL : `${API_URL}/${editingId}`, {
        method: editingId === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const details = await res.json().catch(() => null);
        throw new Error(details?.title || details?.message || `No se pudo guardar la transacción (HTTP ${res.status}).`);
      }
      setDescription('');
      setAmount('');
      setEditingId(null);
      await fetchTransactions();
    } catch (err) {
      console.error('Save error', err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error al guardar la transacción.');
    } finally {
      setLoading(false);
    }
  }

  function editTransaction(transaction) {
    setEditingId(transaction.id);
    setDescription(transaction.description);
    setAmount(String(transaction.amount));
    setType(transaction.type);
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setType('Ingreso');
    setError('');
  }

  async function deleteTransaction(transaction) {
    if (!window.confirm(`¿Seguro que quieres borrar "${transaction.description}"?`)) {
      return;
    }

    try {
      setDeletingId(transaction.id);
      setError('');
      const res = await fetch(`${API_URL}/${transaction.id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`No se pudo borrar la transacción (HTTP ${res.status}).`);
      }

      if (editingId === transaction.id) {
        cancelEdit();
      }
      await fetchTransactions();
    } catch (err) {
      console.error('Delete error', err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error al borrar la transacción.');
    } finally {
      setDeletingId(null);
    }
  }

  function navigateTo(page) {
    setActivePage(page);
    setMobileMenuOpen(false);
  }

  if (!isAuthenticated) {
    return (
      <Auth
        onLoginSuccess={(email, enabled) => {
          setUserEmail(email);
          setTwoFactorEnabled(enabled);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const ingresos = transactions
    .filter(t => t.type === 'Ingreso')
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const gastos = transactions
    .filter(t => t.type === 'Gasto')
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const balance = ingresos - gastos;

  const chartData = transactions.slice().reverse().map((t, i) => ({
    name: t.description || `Movimiento ${i + 1}`,
    Monto: Number(t.amount) || 0,
  }));

  return (
    <div className="app-container">
      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside id="main-navigation" className={`sidebar${mobileMenuOpen ? ' sidebar-open' : ''}`}>
        <h2>Finanzas Pro</h2>
        <button
          type="button"
          className={`menu-item${activePage === 'dashboard' ? ' active' : ''}`}
          aria-current={activePage === 'dashboard' ? 'page' : undefined}
          onClick={() => navigateTo('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          className={`menu-item${activePage === 'history' ? ' active' : ''}`}
          aria-current={activePage === 'history' ? 'page' : undefined}
          onClick={() => navigateTo('history')}
        >
          <History size={18} />
          <span>Historial</span>
        </button>
        <button
          type="button"
          className={`menu-item${activePage === 'security' ? ' active' : ''}`}
          aria-current={activePage === 'security' ? 'page' : undefined}
          onClick={() => navigateTo('security')}
        >
          <ShieldCheck size={18} />
          <span>Seguridad 2FA</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1>Finanzas Pro</h1>
        </header>
        {activePage === 'dashboard' ? (
          <>
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-info">
              <span>Ingresos</span>
              <h3 style={{ color: 'var(--color-income)' }}>${ingresos.toFixed(2)}</h3>
            </div>
            <ArrowUpCircle color="#10b981" size={36} />
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <span>Gastos</span>
              <h3 style={{ color: 'var(--color-expense)' }}>${gastos.toFixed(2)}</h3>
            </div>
            <ArrowDownCircle color="#ef4444" size={36} />
          </div>

          <div className="metric-card">
            <div className="metric-info">
              <span>Balance Total</span>
              <h3>${balance.toFixed(2)}</h3>
            </div>
            <Wallet color="#3b82f6" size={36} />
          </div>
        </section>

        <div className="dashboard-body">
          <div className="card-panel graphic-panel">
            <h3>Evolución Financiera (Últimos Movimientos)</h3>

            <div className="chart-wrapper">
              {chartData.length === 0 ? (
                <p className="muted">Agrega movimientos para generar analíticas.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 1200 }} />
                    <Area type="monotone" dataKey="Monto" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.12} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>

          <div className="card-panel form-panel">
            <h3>
              {editingId === null
                ? <><PlusCircle size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Agregar Transacción</>
                : <><Pencil size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Editar Transacción</>}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Descripción</label>
                <input required value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Sueldo" />
              </div>

              <div className="form-group">
                <label>Monto</label>
                <input required min="0.01" value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" placeholder="Monto" />
              </div>

              <div className="form-group">
                <label>Tipo de Transacción</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Gasto">Gasto</option>
                </select>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Guardando...' : editingId === null ? 'Guardar' : 'Guardar cambios'}
              </button>
              {editingId !== null && (
                <button type="button" className="btn-cancel" onClick={cancelEdit} disabled={loading}>
                  <X size={16} /> Cancelar edición
                </button>
              )}
              {error && <p role="alert" className="form-error">{error}</p>}
            </form>
          </div>
        </div>
          </>
        ) : activePage === 'history' ? (
          <section className="card-panel history-panel">
            <h2>Historial de transacciones</h2>
            {error && <p role="alert" className="form-error">{error}</p>}
            {transactions.length === 0 ? (
              <p className="muted">Todavía no hay transacciones registradas.</p>
            ) : (
              <div className="transaction-list history-list">
                {transactions.map((t, i) => (
                  <div className="transaction-item" key={t.id ?? i}>
                    <div className="tx-info">
                      <h4>{t.description}</h4>
                      <span>{t.type}</span>
                    </div>
                    <div className="transaction-actions">
                      <div className={`tx-amount ${t.type === 'Ingreso' ? 'ingreso' : 'gasto'}`}>
                        {t.type === 'Ingreso' ? '+' : '-'} ${Number(t.amount).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        className="btn-edit"
                        aria-label={`Editar ${t.description}`}
                        title="Editar transacción"
                        disabled={loading || deletingId !== null}
                        onClick={() => editTransaction(t)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        aria-label={`Borrar ${t.description}`}
                        title="Borrar transacción"
                        disabled={loading || deletingId !== null}
                        onClick={() => deleteTransaction(t)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {editingId !== null && (
              <div className="history-form">
                <h3>
                  <Pencil size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Editar Transacción
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Descripción</label>
                    <input required value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Sueldo" />
                  </div>
                  <div className="form-group">
                    <label>Monto</label>
                    <input required min="0.01" value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" placeholder="Monto" />
                  </div>
                  <div className="form-group">
                    <label>Tipo de Transacción</label>
                    <select value={type} onChange={e => setType(e.target.value)}>
                      <option value="Ingreso">Ingreso</option>
                      <option value="Gasto">Gasto</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  {editingId !== null && (
                    <button type="button" className="btn-cancel" onClick={cancelEdit} disabled={loading}>
                      <X size={16} /> Cancelar edición
                    </button>
                  )}
                  {error && <p role="alert" className="form-error">{error}</p>}
                </form>
              </div>
            )}
          </section>
        ) : (
          <ConfiguracionSeguridad
            email={userEmail}
            twoFactorEnabled={twoFactorEnabled}
            onTwoFactorEnabled={() => setTwoFactorEnabled(true)}
          />
        )}
      </main>
    </div>
  );
}