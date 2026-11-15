import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api/v1';

const CHAVE_TOKEN = 'nexopay.token';

// A API exige JWT em todas as rotas, exceto /usuarios. O token é guardado no navegador e
// enviado como cabeçalho padrão do axios (sem interceptors), restaurado a cada carregamento.
const tokenSalvo = localStorage.getItem(CHAVE_TOKEN);
if (tokenSalvo) {
  axios.defaults.headers.common.Authorization = `Bearer ${tokenSalvo}`;
}

export function definirToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function limparToken() {
  localStorage.removeItem(CHAVE_TOKEN);
  delete axios.defaults.headers.common.Authorization;
}

export function temToken() {
  return localStorage.getItem(CHAVE_TOKEN) != null;
}
