import { apiFetch } from './api'

export const usuariosService = {
  me: () => apiFetch('/usuarios/me'),

  login: (email, senha) =>
    apiFetch('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),

  cadastro: (nome, email, senha) =>
    apiFetch('/usuarios', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    }),

  logout: () => apiFetch('/usuarios/logout', { method: 'POST' }),

  esqueciSenha: (email) =>
    apiFetch('/usuarios/esqueci-senha', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetSenha: (token, senha) =>
    apiFetch(`/usuarios/reset-senha/${token}`, {
      method: 'POST',
      body: JSON.stringify({ senha }),
    }),

  ativarConta: (token) => apiFetch(`/usuarios/ativar/${token}`),

  validarTokenReset: (token)  => apiFetch(   `/usuarios/reset/${token}/validar`),

  validarEmail: (email) => apiFetch(`/usuarios/validar-email/${encodeURIComponent(email)}`),



}
