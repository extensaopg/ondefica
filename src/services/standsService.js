import { apiFetch } from './api'

export const standsService = {
  listar: () => apiFetch('/stands/'),

  listarPorEvento: (eventoId) => apiFetch(`/stands/?eventoId=${eventoId}`),

  buscarPorId: (id) => apiFetch(`/stands/${id}`),
  
  buscarPorNome: (nome, eventoId) => 
    apiFetch(`/stands/buscar?q=${encodeURIComponent(nome)}&eventoId=${eventoId}`),

  criar: (dados) =>
    apiFetch('/stands', {
      method: 'POST',
      body: dados,
    }),

  atualizar: (id, dados) =>
    apiFetch(`/stands/${id}`, {
      method: 'PUT',
      body: dados,
    }),

    
  deletar: (id) => apiFetch(`/stands/${id}`, { method: 'DELETE' }),
}
