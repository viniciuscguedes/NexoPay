import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroEmpresa() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/empresas`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [segmento, setSegmento] = useState('');
  const [ativa, setAtiva] = useState('S');
  const [dados, setDados] = useState(null);

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setNome(registro.nome != null ? registro.nome : '');
    setCnpj(registro.cnpj != null ? registro.cnpj : '');
    setRazaoSocial(registro.razaoSocial != null ? registro.razaoSocial : '');
    setSegmento(registro.segmento != null ? registro.segmento : '');
    setAtiva(registro.ativa != null ? registro.ativa : 'S');
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar empresa');
        });
    }
  }

  async function salvar() {
    let data = { id, nome, cnpj, razaoSocial, segmento, ativa };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Empresa cadastrada com sucesso!');
          navigate('/listagem-empresas');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Empresa alterada com sucesso!');
          navigate('/listagem-empresas');
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
      <Card title='Cadastro de Empresa'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' name='nome' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>
              <FormGroup label='CNPJ: *' htmlFor='inputCnpj'>
                <input type='text' id='inputCnpj' value={cnpj} className='form-control' name='cnpj' onChange={(e) => setCnpj(e.target.value)} />
              </FormGroup>
              <FormGroup label='Razão Social: *' htmlFor='inputRazaoSocial'>
                <input type='text' id='inputRazaoSocial' value={razaoSocial} className='form-control' name='razaoSocial' onChange={(e) => setRazaoSocial(e.target.value)} />
              </FormGroup>
              <FormGroup label='Segmento:' htmlFor='inputSegmento'>
                <input type='text' id='inputSegmento' value={segmento} className='form-control' name='segmento' onChange={(e) => setSegmento(e.target.value)} />
              </FormGroup>
              <FormGroup label='Ativa:' htmlFor='inputAtiva'>
                <select className='form-select' id='inputAtiva' name='ativa' value={ativa} onChange={(e) => setAtiva(e.target.value)}>
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
                <button onClick={() => navigate('/listagem-empresas')} type='button' className='btn btn-secondary'>
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

export default CadastroEmpresa;
