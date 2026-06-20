import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'
import '../styles/auth.css'

function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleCadastro(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await usuariosService.cadastro(nome, email, senha)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      setSuccess('Cadastro realizado! Enviado para aprovação do administrador')
      
    } catch {
      setError('Erro ao conectar com servidor')
    }
  }

  return (
    <div className="auth-container">
      <h2>Cadastro</h2>

      <form onSubmit={handleCadastro} className="auth-form">
        <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="auth-input"
        />

        <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
        />

        <input
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="auth-input"
        />

        {error && <p className="auth-msg--error">{error}</p>}
        {success && <p className="auth-msg--success">{success}</p>}

        <button type="submit" className="auth-button auth-button--success">
          Criar conta
        </button>
      </form>

      <p className="auth-link" onClick={() => navigate('/login')}>
        Já tenho conta
      </p>
    </div>
  )
}

export default Cadastro
