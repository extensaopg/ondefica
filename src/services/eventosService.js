import { apiFetch } from './api'

export const eventosService = {
  listar: () => apiFetch('/eventos'),

  meus: () => apiFetch('/eventos/meus'),

  buscarPorId: (id) => apiFetch(`/eventos/${id}`),

  criar: (dados) =>
    apiFetch('/eventos', {
      method: 'POST',
      body: JSON.stringify(dados),
    }),

  atualizar: (id, dados) =>
    apiFetch(`/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }),

  deletar: (id) => apiFetch(`/eventos/${id}`, { method: 'DELETE' }),
}
