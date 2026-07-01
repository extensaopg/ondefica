import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { eventoIcon, standIcon, novoStandIcon } from '../utils/mapIcons'
import StandFormModal from '../components/StandFormModal'
import { eventosService } from '../services/eventosService'
import { standsService } from '../services/standsService'
import '../styles/gerenciarStands.css'

function MapClickHandler({ setMarcadorTemporario }) {
  const map = useMapEvents({ click(e) { 
    setMarcadorTemporario(e.latlng);
    map.flyTo(e.latlng, map.getZoom());
  },
 })
  return null;
}

export default function GerenciarStands() {
  const navigate = useNavigate()
  const { eventoId } = useParams()

  const [evento, setEvento] = useState(null)
  const [stands, setStands] = useState([])
  const [marcadorTemporario, setMarcadorTemporario] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [standEmEdicao, setStandEmEdicao] = useState(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [imagem, setImagem] = useState(null)
  const [removerImagem, setRemoverImagem] = useState(false)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const markerTempRef = useRef(null)

  useEffect(() => {
    if (marcadorTemporario && markerTempRef.current) {
      setTimeout(() => { markerTempRef.current?.openPopup() }, 10)
    }
  }, [marcadorTemporario])

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resEvento = await eventosService.buscarPorId(eventoId)
        if (resEvento.ok) setEvento(await resEvento.json())

        const resStands = await standsService.listarPorEvento(eventoId)
        if (resStands.ok) setStands(await resStands.json())
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      }
    }
    carregarDados()
  }, [eventoId])

  const iniciarCriacaoStand = () => {
    setStandEmEdicao(null)
    setNome('')
    setDescricao('')
    setImagem(null)
    setRemoverImagem(false)
    setDataInicio(evento?.data_inicio ? evento.data_inicio.split('T')[0] : '')
    setDataFim(evento?.data_fim ? evento.data_fim.split('T')[0] : '')
    setModalAberto(true)
  }

  const iniciarEdicaoStand = (stand) => {
    setStandEmEdicao(stand)
    setNome(stand.nome || '')
    setImagem(null)
    setRemoverImagem(false)
    setDescricao(stand.descricao)
    setDataInicio(stand.data_inicio.split('T')[0])
    setDataFim(stand.data_fim.split('T')[0])
    setMarcadorTemporario(null)
    setModalAberto(true)
  }

  const handleSalvarStand = async (e) => {
    e.preventDefault();

    if (!standEmEdicao) {
        try {
            const res = await standsService.buscarPorNome(nome, eventoId);
            if (res.ok) {
                const standsEncontrados = await res.json();
                const duplicado = standsEncontrados.some(
                    s => s.nome.toLowerCase() === nome.toLowerCase()
                );

                if (duplicado) {
                    alert('Erro: Já existe um stand com este nome neste evento!');
                    return; 
                }
            }
        } catch (err) {
            console.error("Erro ao verificar duplicidade:", err);
        }
    }

    const formData = new FormData();

    formData.append('nome', nome);
    formData.append('descricao', descricao || '');
    formData.append('data_inicio', dataInicio);
    formData.append('data_fim', dataFim);
    formData.append('eventoId', eventoId);
    formData.append('cor_icone', 'blue');
    formData.append('removerImagem', removerImagem ? 'true' : 'false');

    const lat = standEmEdicao ? standEmEdicao.latitude : marcadorTemporario.lat;
    const lng = standEmEdicao ? standEmEdicao.longitude : marcadorTemporario.lng;
    formData.append('latitude', lat);
    formData.append('longitude', lng);

    if (imagem) {
      formData.append('imagem', imagem);
    }

    try {
      const isEdicao = !!standEmEdicao;
      
      const res = isEdicao
        ? await standsService.atualizar(standEmEdicao._id, formData)
        : await standsService.criar(formData);

      if (res.ok) {
        const resStand = await res.json();
        const standId = isEdicao ? standEmEdicao._id : resStand.id || resStand._id;
        

        const reqStandSalvo = await standsService.buscarPorId(standId);
        const standSalvo = await reqStandSalvo.json();

        setStands(isEdicao
          ? stands.map((s) => (s._id === standSalvo._id ? standSalvo : s))
          : [...stands, standSalvo]
        );

        alert(`Stand ${isEdicao ? 'atualizado' : 'criado'} com sucesso!`);
        
        setRemoverImagem(false);
        setModalAberto(false);
        setMarcadorTemporario(null);
        setImagem(null);
        
      } else {
        alert('Erro ao processar a requisição no backend.');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    }
  }

  const handleExcluirStand = async (standId) => {
    if (!window.confirm('Tem certeza que deseja excluir este stand?')) return

    try {
      const res = await standsService.deletar(standId)
      if (res.ok) {
        setStands(stands.filter((s) => s._id !== standId))
        alert('Stand excluído com sucesso.')
      } else {
        alert('Falha ao excluir o stand no backend.')
      }
    } catch (err) {
      console.error('Erro de conexão:', err)
    }
  }

  if (!evento) return <div className="stands-loading">Carregando mapa do evento...</div>

  return (
    
    <div className="stands-page">
      <div className="stands-map-container">
        <header className="stands-header">
          <button onClick={() => navigate('/meus-eventos')} className="stands-header__back">← Finalizar e Voltar</button>
          <div>
            <h2 className="stands-header__title">Alocação de Stands</h2>
            <p className="stands-header__subtitle">{evento.descricao}</p>
          </div>
        </header>

        <MapContainer center={[evento.latitude, evento.longitude]} zoom={17} style={{ height: '100vh', width: '100%', zIndex: 0 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
          <MapClickHandler setMarcadorTemporario={setMarcadorTemporario} />

          <Marker position={[evento.latitude, evento.longitude]} icon={eventoIcon}>
            <Popup><strong>📍 Centro do Evento</strong><br />Clique em áreas vazias para adicionar stands.</Popup>
          </Marker>

          {stands.map((stand) => (
            <Marker key={stand._id} position={[stand.latitude, stand.longitude]} icon={standIcon}>
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '15px' }}>{stand.nome}</strong>
                  <p style={{ margin: '5px 0', fontSize: '13px', color: '#666' }}>{stand.descricao}</p>
                  <div className="stands-popup-actions">
                    <button onClick={() => iniciarEdicaoStand(stand)} className="btn-edit">Editar</button>
                    <button onClick={() => handleExcluirStand(stand._id)} className="btn-delete">Excluir</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {marcadorTemporario && (
            <Marker position={marcadorTemporario} icon={novoStandIcon} ref={markerTempRef}>
              <Popup autoPan={true}>
                <div style={{ textAlign: 'center' }}>
                  <strong>Nova Posição Selecionada</strong><br />
                  <button onClick={iniciarCriacaoStand} className="stands-create-btn">➕ Criar stand aqui</button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        <StandFormModal
          aberto={modalAberto}
          fecharModal={() => setModalAberto(false)}
          salvarStand={handleSalvarStand}
          standEmEdicao={standEmEdicao}
          nome={nome} setNome={setNome}
          imagem={imagem} setImagem={setImagem}
          removerImagem={removerImagem} setRemoverImagem={setRemoverImagem}
          descricao={descricao} setDescricao={setDescricao}
          dataInicio={dataInicio} setDataInicio={setDataInicio}
          dataFim={dataFim} setDataFim={setDataFim}
        />
      </div>
    </div>
  )
}
