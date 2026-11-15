import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroTipoBeneficio() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/tiposbeneficio`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valorPadrao, setValorPadrao] = useState('');
  const [ativo, setAtivo] = useState('S');
  const [dados, setDados] = useState(null);

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setNome(registro.nome != null ? registro.nome : '');
    setDescricao(registro.descricao != null ? registro.descricao : '');
    setValorPadrao(registro.valorPadrao != null ? registro.valorPadrao : '');
    setAtivo(registro.ativo != null ? registro.ativo : 'S');
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar tipo de benefício');
        });
    }
  }

  async function salvar() {
    let data = { id, nome, descricao, valorPadrao, ativo };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Tipo de benefício cadastrado com sucesso!');
          navigate('/listagem-tipos-beneficio');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Tipo de benefício alterado com sucesso!');
          navigate('/listagem-tipos-beneficio');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    }
  }

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [idParam]);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Tipo de benefício'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' name='nome' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>
              <FormGroup label='Descrição:' htmlFor='inputDescricao'>
                <input type='text' id='inputDescricao' value={descricao} className='form-control' name='descricao' onChange={(e) => setDescricao(e.target.value)} />
              </FormGroup>
              <FormGroup label='Valor padrão (R$): *' htmlFor='inputValorPadrao'>
                <input type='number' step='0.01' id='inputValorPadrao' value={valorPadrao} className='form-control' name='valorPadrao' onChange={(e) => setValorPadrao(e.target.value)} />
              </FormGroup>
              <FormGroup label='Ativo:' htmlFor='inputAtivo'>
                <select className='form-select' id='inputAtivo' name='ativo' value={ativo} onChange={(e) => setAtivo(e.target.value)}>
                  <option value='S'>Sim</option>
                  <option value='N'>Não</option>
                </select>
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success'>
                  Salvar
                </button>
                <button onClick={inicializar} type='button' className='btn btn-danger'>
                  Cancelar
                </button>
                <button onClick={() => navigate('/listagem-tipos-beneficio')} type='button' className='btn btn-secondary'>
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

export default CadastroTipoBeneficio;
