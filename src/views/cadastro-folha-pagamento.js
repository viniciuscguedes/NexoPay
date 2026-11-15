import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroFolhaPagamento() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/folhaspagamento`;

  const [id, setId] = useState('');
  const [mesReferencia, setMesReferencia] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [anoReferencia, setAnoReferencia] = useState(String(new Date().getFullYear()));
  const [idEmpresa, setIdEmpresa] = useState('');
  const [dados, setDados] = useState(null);
  const [dadosEmpresas, setDadosEmpresas] = useState(null);

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setMesReferencia(registro.mesReferencia != null ? registro.mesReferencia : String(new Date().getMonth() + 1).padStart(2, '0'));
    setAnoReferencia(registro.anoReferencia != null ? registro.anoReferencia : String(new Date().getFullYear()));
    setIdEmpresa(registro.idEmpresa != null ? registro.idEmpresa : '');
  }

  function inicializar() {
    preencher(idParam == null ? {} : dados);
  }

  async function buscar() {
    if (idParam == null) {
      setDados({});
      preencher({});
    } else {
      await axios
        .get(`${baseURL}/${idParam}`)
        .then((response) => {
          setDados(response.data);
          preencher(response.data);
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data, 'Erro ao carregar folha de pagamento');
        });
    }
  }

  async function salvar() {
    let data = { id, mesReferencia, anoReferencia, idEmpresa };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Folha de pagamento cadastrada com sucesso!');
          navigate('/listagem-folhas-pagamento');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Folha de pagamento alterada com sucesso!');
          navigate('/listagem-folhas-pagamento');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    }
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/empresas`)
      .then((response) => {
        setDadosEmpresas(response.data);
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao carregar a lista de empresa');
      });
  }, []);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [idParam]);

  if (!dados) return null;
  if (!dadosEmpresas) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Folha de pagamento'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Mês de referência: *' htmlFor='inputMesReferencia'>
                <select className='form-select' id='inputMesReferencia' name='mesReferencia' value={mesReferencia} onChange={(e) => setMesReferencia(e.target.value)}>
                  <option value='01'>01 - Janeiro</option>
                  <option value='02'>02 - Fevereiro</option>
                  <option value='03'>03 - Março</option>
                  <option value='04'>04 - Abril</option>
                  <option value='05'>05 - Maio</option>
                  <option value='06'>06 - Junho</option>
                  <option value='07'>07 - Julho</option>
                  <option value='08'>08 - Agosto</option>
                  <option value='09'>09 - Setembro</option>
                  <option value='10'>10 - Outubro</option>
                  <option value='11'>11 - Novembro</option>
                  <option value='12'>12 - Dezembro</option>
                </select>
              </FormGroup>
              <FormGroup label='Ano de referência: *' htmlFor='inputAnoReferencia'>
                <input type='number' step='0.01' id='inputAnoReferencia' value={anoReferencia} className='form-control' name='anoReferencia' onChange={(e) => setAnoReferencia(e.target.value)} />
              </FormGroup>
              <FormGroup label='Empresa: *' htmlFor='inputIdEmpresa'>
                <select className='form-select' id='inputIdEmpresa' name='idEmpresa' value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)}>
                  <option key='0' value=''>Selecione...</option>
                  {dadosEmpresas.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success'>
                  Salvar
                </button>
                <button onClick={inicializar} type='button' className='btn btn-danger'>
                  Cancelar
                </button>
                <button onClick={() => navigate('/listagem-folhas-pagamento')} type='button' className='btn btn-secondary'>
                  Voltar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroFolhaPagamento;
