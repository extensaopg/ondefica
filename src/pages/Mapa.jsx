import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Mapview'
import { usuariosService } from '../services/usuariosService'
import '../styles/mapa.css'

function Mapa() {
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  
  const menuRef = useRef(null)

  useEffect(() => {
    usuariosService
      .me()
      .then(async (res) => {
        if (res.status === 401) { setUser(null); return }
        const data = await res.json()
        setUser(data)
      })
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const handleClickFora = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickFora)
    return () => {
      document.removeEventListener('mousedown', handleClickFora)
    }
  }, [])

    function logout() {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/mapa')
    }
  return (
    <div className="map-wrapper">
      <MapView />

      <div className="map-user-box" ref={menuRef}>
        {user ? (
          <>
            <div className="map-avatar" onClick={() => setOpen(!open)}>
              {user.nome?.charAt(0).toUpperCase()}
            </div>

            {open && (
              <div className="map-menu">
                <button onClick={() => {
                    navigate('/meus-eventos');
                    setOpen(false);
                }}>
                    Meus eventos
                </button>
                <button onClick={logout}>Sair</button>
              </div>
            )}
          </>
        ) : (
          <button className="map-btn-login" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
        <button className="map-btn-help" onClick={() => navigate('/faq')} title="Ajuda / Documentação">?</button>
      </div>
    </div>
  )
}

export default Mapa