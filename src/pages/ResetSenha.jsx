import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'
import '../styles/auth.css'

function ResetSenha() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [senha, setSenha] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [validando, setValidando] = useState(true)
  const [tokenValido, setTokenValido] = useState(false)

  useEffect(() => {
    async function validarToken() {

      try {
        const res =
            await usuariosService.validarTokenReset(token)

        const data = await res.json()

        if (res.ok && data.valido) {
          setTokenValido(true)
        }

      } catch (error) {
        console.error(error)
      } finally {
        setValidando(false)
      }
    }

    validarToken()
  }, [token])

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg('')
    setError('')

    try {
      const res = await usuariosService.resetSenha(token, senha)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message)
        return
      }

      setMsg('Senha alterada com sucesso!')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Erro ao conectar com servidor')
    }
  }

  if (validando) {
    return (
        <div className="auth-container">
          <h2>Validando link...</h2>
        </div>
    )
  }
  if (!tokenValido) {
    return (
        <div className="auth-container">
          <h2>Link inválido ou expirado</h2>

          <p className="auth-msg--error">
            Este link de recuperação não é mais válido.
          </p>

          <button
              className="ativar-button"
              onClick={() => navigate('/esqueci-senha')}
          >
            Solicitar novo link
          </button>
        </div>
    )
  }
  return (
    <div className="auth-container">
      <h2>Nova senha</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="auth-input"
        />

        <button className="auth-button auth-button--success">Salvar senha</button>
      </form>

      {msg && <p className="auth-msg--success">{msg}</p>}
      {error && <p className="auth-msg--error">{error}</p>}
    </div>
  )
}

export default ResetSenha
