const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const { headers = {}, ...resto } = options

  const cabecalhos = { ...headers }

  const token = localStorage.getItem('token')

  if (token) {
    cabecalhos['Authorization'] = `Bearer ${token}`
  }

  if (!(resto.body instanceof FormData)) {
    cabecalhos['Content-Type'] =
        cabecalhos['Content-Type'] || 'application/json'
  }

  return await fetch(`${BASE_URL}${path}`, {
    ...resto,
    headers: cabecalhos
  })
}