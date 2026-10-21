import React, { useState } from 'react';

const AUTH_API_URL = 'http://localhost:5138/api/auth';

export default function Auth({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false); // Alternar entre Login y Registro
  const [requires2FA, setRequires2FA] = useState(false); // Activa la vista del token 2FA
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token2FA, setToken2FA] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manejar el Registro o el Primer paso del Login
  const handleSubmitAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? `${AUTH_API_URL}/register` : `${AUTH_API_URL}/login`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || data || 'Ocurrió un error en el servidor');
      }

      if (isRegister) {
        alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
        setIsRegister(false);
        setPassword('');
      } else {
        // Si es Login exitoso, comprobar si exige 2FA
        if (data.requiere2FA) {
          setRequires2FA(true);
        } else {
          // Acceso directo si no tiene 2FA activado
          onLoginSuccess(data.email, Boolean(data.requiere2FA));
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la verificación del código de 6 dígitos si el 2FA está activo
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/2fa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: token2FA })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Código de verificación incorrecto');
      }

      // Código correcto, dar acceso a la app
      onLoginSuccess(email, true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Estilos del contenedor oscuro (Acorde a Finanzas Pro)
  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131928', fontFamily: 'sans-serif' },
    card: { backgroundColor: '#1a2235', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', color: '#fff' },
    title: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#fff' },
    inputGroup: { marginBottom: '1.2rem' },
    label: { display: 'block', fontSize: '0.85rem', color: '#a0aec0', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #2d3748', backgroundColor: '#0f141c', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', transition: 'background-color 0.2s' },
    switchText: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#a0aec0' },
    link: { color: '#34d399', cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px' },
    error: { backgroundColor: '#feb2b2', color: '#9b2c2c', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {requires2FA ? 'Verificación 2FA' : isRegister ? 'Crear Cuenta' : 'Finanzas Pro'}
        </h2>

        {error && <div style={styles.error}>{error}</div>}

        {requires2FA ? (
          /* PANTALLA INTERMEDIA: INTRODUCIR TOKEN 2FA */
          <form onSubmit={handleVerify2FA}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Código de Seguridad de 6 dígitos</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={token2FA}
                onChange={(e) => setToken2FA(e.target.value)}
                style={{ ...styles.input, textAlign: 'center', letterSpacing: '6px', fontSize: '1.4rem' }}
                required
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
            <p style={styles.switchText}>
              ¿Problemas? <span style={styles.link} onClick={() => setRequires2FA(false)}>Volver al login</span>
            </p>
          </form>
        ) : (
          /* PANTALLA PRINCIPAL: LOGIN / REGISTRO */
          <form onSubmit={handleSubmitAuth}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo Electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </button>

            <p style={styles.switchText}>
              {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta informática todavía?'}
              <span style={styles.link} onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
