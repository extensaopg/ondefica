import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'
import '../styles/auth.css'

function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    setError('')

    try {
      const res = await usuariosService.esqueciSenha(email)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      setMsg('Email enviado! Verifique sua caixa de entrada.')
    } catch {
      setError('Erro ao conectar com servidor')
    }
  }

  return (
    <div className="auth-container">
      <h2>Recuperar senha</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />

        <button className="auth-button auth-button--primary">Enviar</button>
      </form>

      {msg && <p className="auth-msg--success">{msg}</p>}
      {error && <p className="auth-msg--error">{error}</p>}

      <p className="auth-link" onClick={() => navigate('/login')}>
        Voltar para login
      </p>
    </div>
  )
}

export default EsqueciSenha
