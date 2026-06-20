import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'
import '../styles/auth.css'

function AtivarConta() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const [status, setStatus] = useState('')
  const [type, setType] = useState('loading')
  const [loading, setLoading] = useState(false)

  async function executar(acao) {
    try {
      setLoading(true)

      const res = await usuariosService.ativarConta(token, acao)
      const data = await res.json()

      if (!res.ok) {
        setStatus(data.message || 'Erro ao processar ação')
        setType('error')
        setLoading(false)
        return
      }

      setStatus(data.message)
      if (acao === 'rejeitar') {
        setType('rejected')
      } else {
        setType('approved')
      }      setLoading(false)

    } catch {
      setStatus('Erro ao conectar com servidor')
      setType('error')
      setLoading(false)
    }
  }

  if (!token) {
    return (
        <div className="auth-container">
          <div className="ativar-card ativar-card--error">
            <h2>Link inválido</h2>
          </div>
        </div>
    )
  }

  return (
      <div className="auth-container">
        <div className={`ativar-card ativar-card--${type}`}>

          <h2>Ação do Administrador</h2>

          {status && <p style={{ marginTop: 10 }}>{status}</p>}

          {type !== 'success' && (
              <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginTop: '25px',
                    alignItems: 'center'
                  }}
              >
                <button
                    disabled={loading}
                    onClick={() => executar('aprovar')}
                    style={{
                      width: '100%',
                      maxWidth: '220px',
                      background: '#2e7d32',
                      color: '#fff',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                >
                  Aprovar
                </button>

                <button
                    disabled={loading}
                    onClick={() => executar('rejeitar')}
                    style={{
                      width: '100%',
                      maxWidth: '220px',
                      background: '#d32f2f',
                      color: '#fff',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                >
                  Rejeitar
                </button>
              </div>
          )}

          {loading && (
              <p className="ativar-card__hint" style={{ marginTop: 15 }}>
                Processando...
              </p>
          )}

        </div>
      </div>
  )
}

export default AtivarConta