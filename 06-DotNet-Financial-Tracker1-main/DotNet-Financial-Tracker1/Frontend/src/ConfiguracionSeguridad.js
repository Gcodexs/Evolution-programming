import React, { useState } from 'react';

const AUTH_API_URL = 'http://localhost:5138/api/auth';

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { mensaje: text };
  }
}

export default function ConfiguracionSeguridad({
  email,
  twoFactorEnabled,
  onTwoFactorEnabled,
}) {
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function startSetup() {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${AUTH_API_URL}/2fa/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.mensaje || data.title || `No se pudo iniciar la configuración (HTTP ${response.status}).`);
      }

      setSetup(data);
    } catch (err) {
      console.error('Security setup error', err);
      setError(err instanceof Error ? err.message : 'No se pudo iniciar la configuración de seguridad.');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${AUTH_API_URL}/2fa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.mensaje || data.title || `No se pudo verificar el código (HTTP ${response.status}).`);
      }

      setSetup(null);
      setCode('');
      setSuccess(data.mensaje || 'La verificación en dos pasos quedó activada.');
      onTwoFactorEnabled();
    } catch (err) {
      console.error('Security verification error', err);
      setError(err instanceof Error ? err.message : 'No se pudo verificar el código.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card-panel security-panel">
      <h2>Configuración de seguridad</h2>
      <p className="muted">
        Protege tu cuenta agregando un código temporal generado por una aplicación de autenticación.
      </p>
      <div className="security-status" role="status">
        <strong>Verificación en dos pasos:</strong>{' '}
        {twoFactorEnabled ? 'Activada' : 'Desactivada'}
      </div>

      {twoFactorEnabled ? (
        <p>Tu cuenta solicita un código de autenticación al iniciar sesión.</p>
      ) : setup ? (
        <div className="security-setup">
          <p>
            Añade esta clave en Google Authenticator, Microsoft Authenticator u otra aplicación
            compatible y luego ingresa el código de seis dígitos:
          </p>
          <label className="security-secret-label" htmlFor="security-secret">Clave de configuración</label>
          <code id="security-secret" className="security-secret">{setup.secret}</code>
          <form onSubmit={verifyCode}>
            <div className="form-group">
              <label htmlFor="security-code">Código de verificación</label>
              <input
                id="security-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                required
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading || code.length !== 6}>
              {loading ? 'Verificando...' : 'Verificar y activar'}
            </button>
          </form>
          <button
            type="button"
            className="btn-cancel security-cancel"
            onClick={() => { setSetup(null); setCode(''); setError(''); }}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button type="button" className="btn-submit security-start" onClick={startSetup} disabled={loading}>
          {loading ? 'Preparando...' : 'Configurar verificación en dos pasos'}
        </button>
      )}

      {error && <p role="alert" className="form-error">{error}</p>}
      {success && <p role="status" className="security-success">{success}</p>}
    </section>
  );
}
