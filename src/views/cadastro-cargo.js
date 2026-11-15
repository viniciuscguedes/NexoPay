import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroCargo() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/cargos`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState('');
  const [tipoRisco, setTipoRisco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [percentualPericulosidade, setPercentualPericulosidade] = useState('');
  const [percentualInsalubridade, setPercentualInsalubridade] = useState('');
  const [idDepartamento, setIdDepartamento] = useState('');
  const [dados, setDados] = useState(null);
  const [dadosDepartamentos, setDadosDepartamentos] = useState(null);

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setNome(registro.nome != null ? registro.nome : '');
    setNivel(registro.nivel != null ? registro.nivel : '');
    setTipoRisco(registro.tipoRisco != null ? registro.tipoRisco : '');
    setDescricao(registro.descricao != null ? registro.descricao : '');
    setPercentualPericulosidade(registro.percentualPericulosidade != null ? registro.percentualPericulosidade : '');
    setPercentualInsalubridade(registro.percentualInsalubridade != null ? registro.percentualInsalubridade : '');
    setIdDepartamento(registro.idDepartamento != null ? registro.idDepartamento : '');
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar cargo');
        });
    }
  }

  async function salvar() {
    let data = { id, nome, nivel, tipoRisco, descricao, percentualPericulosidade, percentualInsalubridade, idDepartamento };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Cargo cadastrado com sucesso!');
          navigate('/listagem-cargos');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Cargo alterado com sucesso!');
          navigate('/listagem-cargos');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    }
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/departamentos`)
      .then((response) => {
        setDadosDepartamentos(response.data);
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao carregar a lista de departamento');
      });
  }, []);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [idParam]);

  if (!dados) return null;
  if (!dadosDepartamentos) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Cargo'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' name='nome' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>
              <FormGroup label='Nível:' htmlFor='inputNivel'>
                <input type='text' id='inputNivel' value={nivel} className='form-control' name='nivel' onChange={(e) => setNivel(e.target.value)} />
              </FormGroup>
              <FormGroup label='Tipo de risco:' htmlFor='inputTipoRisco'>
                <input type='text' id='inputTipoRisco' value={tipoRisco} className='form-control' name='tipoRisco' onChange={(e) => setTipoRisco(e.target.value)} />
              </FormGroup>
              <FormGroup label='Descrição:' htmlFor='inputDescricao'>
                <input type='text' id='inputDescricao' value={descricao} className='form-control' name='descricao' onChange={(e) => setDescricao(e.target.value)} />
              </FormGroup>
              <FormGroup label='Percentual de periculosidade (%):' htmlFor='inputPercentualPericulosidade'>
                <input type='number' step='0.01' id='inputPercentualPericulosidade' value={percentualPericulosidade} className='form-control' name='percentualPericulosidade' onChange={(e) => setPercentualPericulosidade(e.target.value)} />
              </FormGroup>
              <FormGroup label='Percentual de insalubridade (%):' htmlFor='inputPercentualInsalubridade'>
                <input type='number' step='0.01' id='inputPercentualInsalubridade' value={percentualInsalubridade} className='form-control' name='percentualInsalubridade' onChange={(e) => setPercentualInsalubridade(e.target.value)} />
              </FormGroup>
              <FormGroup label='Departamento: *' htmlFor='inputIdDepartamento'>
                <select className='form-select' id='inputIdDepartamento' name='idDepartamento' value={idDepartamento} onChange={(e) => setIdDepartamento(e.target.value)}>
                  <option key='0' value=''>Selecione...</option>
                  {dadosDepartamentos.map((dado) => (
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
                <button onClick={() => navigate('/listagem-cargos')} type='button' className='btn btn-secondary'>
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

export default CadastroCargo;
