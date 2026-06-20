import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'
import '../styles/auth.css'

function AtivarConta() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Ativando sua conta...')
  const [type, setType] = useState('loading')
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const token = params.get('token')

    async function ativar() {
      try {
        const res = await usuariosService.ativarConta(token)
        const data = await res.json()

        if (!res.ok) {
          setStatus(data.message || 'Erro ao ativar conta')
          setType('error')
          return
        }

        setStatus('Conta ativada com sucesso! 🎉')
        setType('success')
        setTimeout(() => navigate('/login'), 2500)
      } catch {
        setStatus('Erro ao conectar com servidor')
        setType('error')
      }
    }

    ativar()
  }, [])

  return (
    <div className="auth-container">
      <div className={`ativar-card ativar-card--${type}`}>
        <h2>Ativação de Conta</h2>
        <p>{status}</p>

        {type === 'loading' && <p className="ativar-card__hint">Aguarde...</p>}
        {type === 'success' && <p className="ativar-card__hint">Redirecionando para login...</p>}
        {type === 'error' && <p className="ativar-card__hint">Verifique o link do email</p>}
      </div>
    </div>
  )
}

export default AtivarConta
