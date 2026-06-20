import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usuariosService } from '../services/usuariosService'

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    usuariosService
      .me()
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, [])

  function logout() {
    usuariosService.logout().then(() => {
      setUser(null)
      navigate('/login')
    })
  }

  return (
    <div style={styles.bar}>
      <h3>Mapa de Eventos</h3>

      {user ? (
        <div style={styles.userBox}>
          <div style={styles.avatar}>{user.nome?.charAt(0).toUpperCase()}</div>
          <div style={styles.menu}>
            <button onClick={() => navigate('/meus-eventos')}>Meus eventos</button>
            <button onClick={logout}>Sair</button>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate('/login')}>Login</button>
      )}
    </div>
  )
}

const styles = {
  bar: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', zIndex: 1000 },
  userBox: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 35, height: 35, borderRadius: '50%', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  menu: { display: 'flex', gap: 10 },
}

export default Navbar
