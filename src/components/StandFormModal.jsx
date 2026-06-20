export default function StandFormModal({
    aberto,
    fecharModal,
    salvarStand,
    standEmEdicao,
    nome, setNome,
    imagem, setImagem,          
    removerImagem, setRemoverImagem,
    descricao, setDescricao,
    dataInicio, setDataInicio,
    dataFim, setDataFim
}) {
    if (!aberto) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h3 style={{ margin: '0 0 20px 0', color: '#1976D2' }}>
                    {standEmEdicao ? 'Editar Stand' : 'Novo Stand'}
                </h3>
                
                <form onSubmit={salvarStand} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome do Stand</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Ex: Stand da Computação"
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            style={styles.input} 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Descrição Detalhada</label>
                        <textarea 
                            placeholder="Descreva este stand do evento (Opcional)."
                            value={descricao} 
                            onChange={e => setDescricao(e.target.value)} 
                            style={{...styles.input, minHeight: '80px', resize: 'vertical'}} 
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Foto do Stand (Opcional)</label>
                        
                        {/* CASO 1: Existe imagem cadastrada no banco e o usuário NÃO clicou em remover nem escolheu um arquivo novo */}
                        {standEmEdicao?.imagem && !removerImagem && !imagem && (
                            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <img 
                                    src={standEmEdicao.imagem} 
                                    alt="Imagem atual" 
                                    style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setRemoverImagem(true)} 
                                    style={styles.removeBtn}
                                >
                                    🗑️ Remover Imagem Atual
                                </button>
                            </div>
                        )}

                        {/* CASO 2: O usuário acabou de selecionar um arquivo NOVO no computador/celular */}
                        {imagem && (
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ fontSize: '13px', color: '#1976D2', display: 'block', fontWeight: '500' }}>
                                    ✔️ Nova foto: {imagem.name}
                                </span>
                                <button 
                                    type="button" 
                                    onClick={() => setImagem(null)} 
                                    style={{ ...styles.removeBtn, color: '#666', borderColor: '#CCC' }}
                                >
                                    Cancelar alteração
                                </button>
                            </div>
                        )}

                        {/* CASO 3: Mostra o campo de Upload tradicional se o stand não tiver foto ou se o usuário removeu a antiga */}
                        {(!standEmEdicao?.imagem || removerImagem) && !imagem && (
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setImagem(e.target.files[0]);
                                        setRemoverImagem(false); // Se escolheu uma nova, cancela a remoção pura
                                    }
                                }}
                                style={styles.inputFile} 
                            />
                        )}
                    </div>

                    <div style={styles.modalActions}>
                        <button type="button" onClick={fecharModal} style={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" style={styles.saveBtn}>Salvar Stand</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const styles = {
    modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalContent: { background: '#FFF', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' },
    row: { display: 'flex', gap: '16px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#444' },
    input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none', backgroundColor: '#FAFAFA', fontFamily: 'inherit' },
    modalActions: { display: 'flex', gap: '12px', marginTop: '24px' },
    cancelBtn: { flex: 1, padding: '12px', background: '#F4F6F8', color: '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    saveBtn: { flex: 1, padding: '12px', background: '#1976D2', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    inputFile: { width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed #1976D2', backgroundColor: '#F8FAFC', cursor: 'pointer', boxSizing: 'border-box'},
    removeBtn: {padding: '6px 12px',background: '#FFF',color: '#D32F2F',border: '1px solid #D32F2F',borderRadius: '6px',cursor: 'pointer',fontSize: '12px',fontWeight: 'bold',marginTop: '4px',transition: 'all 0.2s'}
    
}