import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroDependente() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/dependentes`;

  const [id, setId] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [dataNascimento, setDataNascimento] = useState(null);
  const [ativo, setAtivo] = useState('S');
  const [dados, setDados] = useState(null);
  const [dadosFuncionarios, setDadosFuncionarios] = useState(null);

  function formatarDataApi(data) {
    return data && data.isValid() ? data.format('YYYY-MM-DD') : '';
  }

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setIdFuncionario(registro.idFuncionario != null ? registro.idFuncionario : '');
    setNome(registro.nome != null ? registro.nome : '');
    setCpf(registro.cpf != null ? registro.cpf : '');
    setParentesco(registro.parentesco != null ? registro.parentesco : '');
    setDataNascimento(registro.dataNascimento ? dayjs(registro.dataNascimento) : null);
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar dependente');
        });
    }
  }

  async function salvar() {
    let data = { id, idFuncionario, nome, cpf, parentesco, dataNascimento: formatarDataApi(dataNascimento), ativo };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Dependente cadastrado com sucesso!');
          navigate('/listagem-dependentes');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Dependente alterado com sucesso!');
          navigate('/listagem-dependentes');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    }
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/funcionarios`)
      .then((response) => {
        setDadosFuncionarios(response.data);
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao carregar a lista de funcionário');
      });
  }, []);

  useEffect(() => {
    buscar(); // eslint-disable-next-line
  }, [idParam]);

  if (!dados) return null;
  if (!dadosFuncionarios) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Dependente'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Funcionário: *' htmlFor='inputIdFuncionario'>
                <select className='form-select' id='inputIdFuncionario' name='idFuncionario' value={idFuncionario} onChange={(e) => setIdFuncionario(e.target.value)}>
                  <option key='0' value=''>Selecione...</option>
                  {dadosFuncionarios.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' name='nome' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>
              <FormGroup label='CPF:' htmlFor='inputCpf'>
                <input type='text' id='inputCpf' value={cpf} className='form-control' name='cpf' onChange={(e) => setCpf(e.target.value)} />
              </FormGroup>
              <FormGroup label='Parentesco: *' htmlFor='inputParentesco'>
                <input type='text' id='inputParentesco' value={parentesco} className='form-control' name='parentesco' onChange={(e) => setParentesco(e.target.value)} />
              </FormGroup>
              <FormGroup label='Data de nascimento: *' htmlFor='inputDataNascimento'>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
                  <DesktopDatePicker
                    inputFormat='DD/MM/YYYY'
                    value={dataNascimento}
                    onChange={(novaData) => setDataNascimento(novaData)}
                    renderInput={(params) => <TextField {...params} id='inputDataNascimento' size='small' fullWidth />}
                  />
                </LocalizationProvider>
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
                <button onClick={() => navigate('/listagem-dependentes')} type='button' className='btn btn-secondary'>
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

export default CadastroDependente;
