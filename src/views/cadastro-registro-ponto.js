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

function CadastroRegistroPonto() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/registrosponto`;

  const [id, setId] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [data, setData] = useState(null);
  const [tipoDia, setTipoDia] = useState('NORMAL');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSaida, setHoraSaida] = useState('');
  const [horaInicioIntervalo, setHoraInicioIntervalo] = useState('');
  const [horaFimIntervalo, setHoraFimIntervalo] = useState('');
  const [observacao, setObservacao] = useState('');
  const [dados, setDados] = useState(null);
  const [dadosFuncionarios, setDadosFuncionarios] = useState(null);

  function formatarDataApi(data) {
    return data && data.isValid() ? data.format('YYYY-MM-DD') : '';
  }

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setIdFuncionario(registro.idFuncionario != null ? registro.idFuncionario : '');
    setData(registro.data ? dayjs(registro.data) : null);
    setTipoDia(registro.tipoDia != null ? registro.tipoDia : 'NORMAL');
    setHoraEntrada(registro.horaEntrada != null ? registro.horaEntrada : '');
    setHoraSaida(registro.horaSaida != null ? registro.horaSaida : '');
    setHoraInicioIntervalo(registro.horaInicioIntervalo != null ? registro.horaInicioIntervalo : '');
    setHoraFimIntervalo(registro.horaFimIntervalo != null ? registro.horaFimIntervalo : '');
    setObservacao(registro.observacao != null ? registro.observacao : '');
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar registro de ponto');
        });
    }
  }

  async function salvar() {
    let data = { id, idFuncionario, data: formatarDataApi(data), tipoDia, horaEntrada, horaSaida, horaInicioIntervalo, horaFimIntervalo, observacao };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Registro de ponto cadastrado com sucesso!');
          navigate('/listagem-registros-ponto');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Registro de ponto alterado com sucesso!');
          navigate('/listagem-registros-ponto');
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
      <Card title='Cadastro de Registro de ponto'>
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
              <FormGroup label='Data: *' htmlFor='inputData'>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
                  <DesktopDatePicker
                    inputFormat='DD/MM/YYYY'
                    value={data}
                    onChange={(novaData) => setData(novaData)}
                    renderInput={(params) => <TextField {...params} id='inputData' size='small' fullWidth />}
                  />
                </LocalizationProvider>
              </FormGroup>
              <FormGroup label='Tipo do dia:' htmlFor='inputTipoDia'>
                <select className='form-select' id='inputTipoDia' name='tipoDia' value={tipoDia} onChange={(e) => setTipoDia(e.target.value)}>
                  <option value='NORMAL'>Normal</option>
                  <option value='FALTA'>Falta</option>
                  <option value='DOMINGO'>Domingo</option>
                  <option value='FERIADO'>Feriado</option>
                </select>
              </FormGroup>
              <FormGroup label='Hora de entrada:' htmlFor='inputHoraEntrada'>
                <input type='time' id='inputHoraEntrada' value={horaEntrada} className='form-control' name='horaEntrada' onChange={(e) => setHoraEntrada(e.target.value)} />
              </FormGroup>
              <FormGroup label='Hora de saída:' htmlFor='inputHoraSaida'>
                <input type='time' id='inputHoraSaida' value={horaSaida} className='form-control' name='horaSaida' onChange={(e) => setHoraSaida(e.target.value)} />
              </FormGroup>
              <FormGroup label='Início do intervalo:' htmlFor='inputHoraInicioIntervalo'>
                <input type='time' id='inputHoraInicioIntervalo' value={horaInicioIntervalo} className='form-control' name='horaInicioIntervalo' onChange={(e) => setHoraInicioIntervalo(e.target.value)} />
              </FormGroup>
              <FormGroup label='Fim do intervalo:' htmlFor='inputHoraFimIntervalo'>
                <input type='time' id='inputHoraFimIntervalo' value={horaFimIntervalo} className='form-control' name='horaFimIntervalo' onChange={(e) => setHoraFimIntervalo(e.target.value)} />
              </FormGroup>
              <FormGroup label='Observação:' htmlFor='inputObservacao'>
                <input type='text' id='inputObservacao' value={observacao} className='form-control' name='observacao' onChange={(e) => setObservacao(e.target.value)} />
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success'>
                  Salvar
                </button>
                <button onClick={inicializar} type='button' className='btn btn-danger'>
                  Cancelar
                </button>
                <button onClick={() => navigate('/listagem-registros-ponto')} type='button' className='btn btn-secondary'>
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

export default CadastroRegistroPonto;
