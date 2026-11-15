import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { temToken } from './config/axios';
import Login from './views/login';
import AcompanhamentoFolhaPagamento from './views/acompanhamento-folha-pagamento';
import CadastroEmpresa from './views/cadastro-empresa';
import ListagemEmpresas from './views/listagem-empresas';
import CadastroDepartamento from './views/cadastro-departamento';
import ListagemDepartamentos from './views/listagem-departamentos';
import CadastroCargo from './views/cadastro-cargo';
import ListagemCargos from './views/listagem-cargos';
import CadastroFuncionario from './views/cadastro-funcionario';
import ListagemFuncionarios from './views/listagem-funcionarios';
import CadastroDependente from './views/cadastro-dependente';
import ListagemDependentes from './views/listagem-dependentes';
import CadastroContratoTrabalho from './views/cadastro-contrato-trabalho';
import ListagemContratosTrabalho from './views/listagem-contratos-trabalho';
import CadastroRegistroPonto from './views/cadastro-registro-ponto';
import ListagemRegistrosPonto from './views/listagem-registros-ponto';
import CadastroTipoBeneficio from './views/cadastro-tipo-beneficio';
import ListagemTiposBeneficio from './views/listagem-tipos-beneficio';
import CadastroFuncionarioBeneficio from './views/cadastro-funcionario-beneficio';
import ListagemFuncionariosBeneficios from './views/listagem-funcionarios-beneficios';
import CadastroFolhaPagamento from './views/cadastro-folha-pagamento';
import ListagemFolhasPagamento from './views/listagem-folhas-pagamento';

// Sem token a pessoa é enviada ao login (a API recusaria qualquer chamada de qualquer forma).
function RotaPrivada({ children }) {
  return temToken() ? children : <Navigate to='/login' replace />;
}

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/listagem-folhas-pagamento' replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/listagem-empresas' element={<RotaPrivada><ListagemEmpresas /></RotaPrivada>} />
        <Route path='/cadastro-empresas/:idParam?' element={<RotaPrivada><CadastroEmpresa /></RotaPrivada>} />
        <Route path='/listagem-departamentos' element={<RotaPrivada><ListagemDepartamentos /></RotaPrivada>} />
        <Route path='/cadastro-departamentos/:idParam?' element={<RotaPrivada><CadastroDepartamento /></RotaPrivada>} />
        <Route path='/listagem-cargos' element={<RotaPrivada><ListagemCargos /></RotaPrivada>} />
        <Route path='/cadastro-cargos/:idParam?' element={<RotaPrivada><CadastroCargo /></RotaPrivada>} />
        <Route path='/listagem-funcionarios' element={<RotaPrivada><ListagemFuncionarios /></RotaPrivada>} />
        <Route path='/cadastro-funcionarios/:idParam?' element={<RotaPrivada><CadastroFuncionario /></RotaPrivada>} />
        <Route path='/listagem-dependentes' element={<RotaPrivada><ListagemDependentes /></RotaPrivada>} />
        <Route path='/cadastro-dependentes/:idParam?' element={<RotaPrivada><CadastroDependente /></RotaPrivada>} />
        <Route path='/listagem-contratos-trabalho' element={<RotaPrivada><ListagemContratosTrabalho /></RotaPrivada>} />
        <Route path='/cadastro-contratos-trabalho/:idParam?' element={<RotaPrivada><CadastroContratoTrabalho /></RotaPrivada>} />
        <Route path='/listagem-registros-ponto' element={<RotaPrivada><ListagemRegistrosPonto /></RotaPrivada>} />
        <Route path='/cadastro-registros-ponto/:idParam?' element={<RotaPrivada><CadastroRegistroPonto /></RotaPrivada>} />
        <Route path='/listagem-tipos-beneficio' element={<RotaPrivada><ListagemTiposBeneficio /></RotaPrivada>} />
        <Route path='/cadastro-tipos-beneficio/:idParam?' element={<RotaPrivada><CadastroTipoBeneficio /></RotaPrivada>} />
        <Route path='/listagem-funcionarios-beneficios' element={<RotaPrivada><ListagemFuncionariosBeneficios /></RotaPrivada>} />
        <Route path='/cadastro-funcionarios-beneficios/:idParam?' element={<RotaPrivada><CadastroFuncionarioBeneficio /></RotaPrivada>} />
        <Route path='/listagem-folhas-pagamento' element={<RotaPrivada><ListagemFolhasPagamento /></RotaPrivada>} />
        <Route path='/cadastro-folhas-pagamento/:idParam?' element={<RotaPrivada><CadastroFolhaPagamento /></RotaPrivada>} />
        <Route path='/acompanhamento-folha-pagamento/:idParam' element={<RotaPrivada><AcompanhamentoFolhaPagamento /></RotaPrivada>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
