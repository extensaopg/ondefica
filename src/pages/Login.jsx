import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'
import '../styles/auth.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await usuariosService.login(email, senha)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      navigate('/mapa')
    } catch {
      setError('Erro ao conectar com servidor')
    }
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="auth-form">
        <input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
        />

        <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="auth-input"
        />

        {error && <p className="auth-msg--error">{error}</p>}

        <button type="submit" className="auth-button auth-button--primary">
          Entrar
        </button>
      </form>

      <div className="auth-links">
        <p className="auth-link" onClick={() => navigate('/esqueci-senha')}>
          Esqueci minha senha
        </p>
        <p className="auth-link" onClick={() => navigate('/cadastro')}>
          Criar conta
        </p>
      </div>
    </div>
  )
}

export default Login
