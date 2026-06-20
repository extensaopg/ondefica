const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const { headers = {}, ...restoDasOpcoes } = options;

  const cabecalhosFinais = { ...headers };

  if (!(restoDasOpcoes.body instanceof FormData)) {
    cabecalhosFinais['Content-Type'] = cabecalhosFinais['Content-Type'] || 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...restoDasOpcoes,
    headers: cabecalhosFinais,
  });
  
  return res;
}