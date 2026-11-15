import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  timeOut: 4000,
};

export function mostrarMensagem(titulo, mensagem, tipo) {
  toastr[tipo](mensagem, titulo);
}

// A API devolve texto puro nos erros de regra de negócio; em falhas de segurança ou de rede
// o corpo pode ser um objeto ou não existir, então há mensagens padrão para esses casos.
function textoDoErro(mensagem, padrao) {
  if (typeof mensagem === 'string' && mensagem.trim() !== '') {
    return mensagem;
  }
  if (mensagem && (mensagem.status === 401 || mensagem.status === 403)) {
    return 'Sessão expirada ou sem permissão. Faça login novamente.';
  }
  return padrao;
}

export function mensagemSucesso(mensagem) {
  mostrarMensagem('Sucesso', mensagem, 'success');
}

export function mensagemErro(mensagem, padrao = 'Falha na comunicação com o servidor') {
  mostrarMensagem('Erro', textoDoErro(mensagem, padrao), 'error');
}

export function mensagemAlert(mensagem) {
  mostrarMensagem('Alerta', mensagem, 'warning');
}
