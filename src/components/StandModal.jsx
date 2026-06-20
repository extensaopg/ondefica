export default function StandModal({ stand, onClose, onTracarRota }) {
    if (!stand) return null;

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', padding: '24px', borderRadius: '12px',
                width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ marginTop: 0, color: '#333' }}>{stand.nome}</h2>
                <h3 style={{ marginTop: 0, color: '#333' }}>{stand.descricao}</h3>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button 
                        onClick={onClose}
                        style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Fechar
                    </button>
                    <button 
                        onClick={() => onTracarRota([stand.latitude, stand.longitude])}
                        style={{ flex: 1, padding: '10px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Ir para o stand
                    </button>
                </div>
            </div>
        </div>
    );
}