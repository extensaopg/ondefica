import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      
      <div className="home-left">
        <div className='title'>
        <h1>Onde Fica? <br/></h1>
        <img src="../src/assets/pinpoint.png" className="bg-icon" alt="" />
        </div>
        <p style={{ color: '#ffffff', fontSize: '1.2rem' }}>
          Encontre aquele evento ou stand com facilidade!
        </p>
      </div>

      <div className="home-right">
        <h2 style={{ marginBottom: '1rem' }}>Entrar no sistema</h2>
        
        <button 
          className="home-btn btn-secondary" 
          onClick={() => navigate('/mapa')}
        >
          Ver Mapa de Eventos
        </button>

        <button 
          className="home-btn btn-outline" 
          onClick={() => navigate('/login')}
        >
          Fazer Login
        </button>

        <button 
          className="home-btn" 
          style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#64748b' }}
          onClick={() => navigate('/faq')}
        >
          Precisa de ajuda?
        </button>
      </div>
    </div>
  );
}

export default Home;