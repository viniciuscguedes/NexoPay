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

function CadastroFuncionario() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/funcionarios`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [matricula, setMatricula] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState(null);
  const [status, setStatus] = useState('ATIVO');
  const [idCargo, setIdCargo] = useState('');
  const [idDepartamento, setIdDepartamento] = useState('');
  const [dados, setDados] = useState(null);
  const [dadosCargos, setDadosCargos] = useState(null);
  const [dadosDepartamentos, setDadosDepartamentos] = useState(null);

  function formatarDataApi(data) {
    return data && data.isValid() ? data.format('YYYY-MM-DD') : '';
  }

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setNome(registro.nome != null ? registro.nome : '');
    setCpf(registro.cpf != null ? registro.cpf : '');
    setEmail(registro.email != null ? registro.email : '');
    setCelular(registro.celular != null ? registro.celular : '');
    setMatricula(registro.matricula != null ? registro.matricula : '');
    setDataAdmissao(registro.dataAdmissao ? dayjs(registro.dataAdmissao) : null);
    setStatus(registro.status != null ? registro.status : 'ATIVO');
    setIdCargo(registro.idCargo != null ? registro.idCargo : '');
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar funcionário');
        });
    }
  }

  async function salvar() {
    let data = { id, nome, cpf, email, celular, matricula, dataAdmissao: formatarDataApi(dataAdmissao), status, idCargo, idDepartamento };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Funcionário cadastrado com sucesso!');
          navigate('/listagem-funcionarios');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Funcionário alterado com sucesso!');
          navigate('/listagem-funcionarios');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    }
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/cargos`)
      .then((response) => {
        setDadosCargos(response.data);
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao carregar a lista de cargo');
      });
  }, []);

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
  if (!dadosCargos) return null;
  if (!dadosDepartamentos) return null;

  return (
    <div className='container'>
      <Card title='Cadastro de Funcionário'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Nome: *' htmlFor='inputNome'>
                <input type='text' id='inputNome' value={nome} className='form-control' name='nome' onChange={(e) => setNome(e.target.value)} />
              </FormGroup>
              <FormGroup label='CPF: *' htmlFor='inputCpf'>
                <input type='text' id='inputCpf' value={cpf} className='form-control' name='cpf' onChange={(e) => setCpf(e.target.value)} />
              </FormGroup>
              <FormGroup label='E-mail:' htmlFor='inputEmail'>
                <input type='text' id='inputEmail' value={email} className='form-control' name='email' onChange={(e) => setEmail(e.target.value)} />
              </FormGroup>
              <FormGroup label='Celular:' htmlFor='inputCelular'>
                <input type='text' id='inputCelular' value={celular} className='form-control' name='celular' onChange={(e) => setCelular(e.target.value)} />
              </FormGroup>
              <FormGroup label='Matrícula: *' htmlFor='inputMatricula'>
                <input type='text' id='inputMatricula' value={matricula} className='form-control' name='matricula' onChange={(e) => setMatricula(e.target.value)} />
              </FormGroup>
              <FormGroup label='Data de admissão: *' htmlFor='inputDataAdmissao'>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
                  <DesktopDatePicker
                    inputFormat='DD/MM/YYYY'
                    value={dataAdmissao}
                    onChange={(novaData) => setDataAdmissao(novaData)}
                    renderInput={(params) => <TextField {...params} id='inputDataAdmissao' size='small' fullWidth />}
                  />
                </LocalizationProvider>
              </FormGroup>
              <FormGroup label='Status:' htmlFor='inputStatus'>
                <select className='form-select' id='inputStatus' name='status' value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value='ATIVO'>Ativo</option>
                  <option value='INATIVO'>Inativo</option>
                  <option value='AFASTADO'>Afastado</option>
                </select>
              </FormGroup>
              <FormGroup label='Cargo: *' htmlFor='inputIdCargo'>
                <select className='form-select' id='inputIdCargo' name='idCargo' value={idCargo} onChange={(e) => setIdCargo(e.target.value)}>
                  <option key='0' value=''>Selecione...</option>
                  {dadosCargos.map((dado) => (
                    <option key={dado.id} value={dado.id}>
                      {dado.nome}
                    </option>
                  ))}
                </select>
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
                <button onClick={() => navigate('/listagem-funcionarios')} type='button' className='btn btn-secondary'>
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

export default CadastroFuncionario;
