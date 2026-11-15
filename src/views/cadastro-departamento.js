import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroDepartamento() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/departamentos`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const [dados, setDados] = useState(null);
  const [dadosEmpresas, setDadosEmpresas] = useState(null);

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setNome(registro.nome != null ? registro.nome : '');
    setDescricao(registro.descricao != null ? registro.descricao : '');
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar departamento');
        });
    }
  }

  async function salvar() {
    let data = { id, nome, descricao, idEmpresa };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Departamento cadastrado com sucesso!');
          navigate('/listagem-departamentos');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Departamento alterado com sucesso!');
          navigate('/listagem-departamentos');
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
      <Card title='Cadastro de Departamento'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' name='nome' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>
              <FormGroup label='Descrição:' htmlFor='inputDescricao'>
                <input type='text' id='inputDescricao' value={descricao} className='form-control' name='descricao' onChange={(e) => setDescricao(e.target.value)} />
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
                <button onClick={() => navigate('/listagem-departamentos')} type='button' className='btn btn-secondary'>
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

export default CadastroDepartamento;
