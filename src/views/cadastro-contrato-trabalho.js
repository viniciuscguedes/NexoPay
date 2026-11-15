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

function CadastroContratoTrabalho() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/contratostrabalho`;

  const [id, setId] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [tipoContrato, setTipoContrato] = useState('');
  const [salarioBase, setSalarioBase] = useState('');
  const [cargaHorariaDiaria, setCargaHorariaDiaria] = useState('8');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [optanteVT, setOptanteVT] = useState('N');
  const [dados, setDados] = useState(null);
  const [dadosFuncionarios, setDadosFuncionarios] = useState(null);

  function formatarDataApi(data) {
    return data && data.isValid() ? data.format('YYYY-MM-DD') : '';
  }

  function preencher(registro) {
    setId(registro.id != null ? registro.id : '');
    setIdFuncionario(registro.idFuncionario != null ? registro.idFuncionario : '');
    setTipoContrato(registro.tipoContrato != null ? registro.tipoContrato : '');
    setSalarioBase(registro.salarioBase != null ? registro.salarioBase : '');
    setCargaHorariaDiaria(registro.cargaHorariaDiaria != null ? registro.cargaHorariaDiaria : '8');
    setDataInicio(registro.dataInicio ? dayjs(registro.dataInicio) : null);
    setDataFim(registro.dataFim ? dayjs(registro.dataFim) : null);
    setOptanteVT(registro.optanteVT != null ? registro.optanteVT : 'N');
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
          mensagemErro(error.response && error.response.data, 'Erro ao carregar contrato de trabalho');
        });
    }
  }

  async function salvar() {
    let data = { id, idFuncionario, tipoContrato, salarioBase, cargaHorariaDiaria, dataInicio: formatarDataApi(dataInicio), dataFim: formatarDataApi(dataFim), optanteVT };
    data = JSON.stringify(data);
    if (idParam == null) {
      await axios
        .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Contrato de trabalho cadastrado com sucesso!');
          navigate('/listagem-contratos-trabalho');
        })
        .catch(function (error) {
          mensagemErro(error.response && error.response.data);
        });
    } else {
      await axios
        .put(`${baseURL}/${idParam}`, data, { headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
          mensagemSucesso('Contrato de trabalho alterado com sucesso!');
          navigate('/listagem-contratos-trabalho');
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
      <Card title='Cadastro de Contrato de trabalho'>
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
              <FormGroup label='Tipo de contrato: *' htmlFor='inputTipoContrato'>
                <input type='text' id='inputTipoContrato' value={tipoContrato} className='form-control' name='tipoContrato' onChange={(e) => setTipoContrato(e.target.value)} />
              </FormGroup>
              <FormGroup label='Salário base (R$): *' htmlFor='inputSalarioBase'>
                <input type='number' step='0.01' id='inputSalarioBase' value={salarioBase} className='form-control' name='salarioBase' onChange={(e) => setSalarioBase(e.target.value)} />
              </FormGroup>
              <FormGroup label='Carga horária diária (h): *' htmlFor='inputCargaHorariaDiaria'>
                <input type='number' step='0.01' id='inputCargaHorariaDiaria' value={cargaHorariaDiaria} className='form-control' name='cargaHorariaDiaria' onChange={(e) => setCargaHorariaDiaria(e.target.value)} />
              </FormGroup>
              <FormGroup label='Data de início: *' htmlFor='inputDataInicio'>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
                  <DesktopDatePicker
                    inputFormat='DD/MM/YYYY'
                    value={dataInicio}
                    onChange={(novaData) => setDataInicio(novaData)}
                    renderInput={(params) => <TextField {...params} id='inputDataInicio' size='small' fullWidth />}
                  />
                </LocalizationProvider>
              </FormGroup>
              <FormGroup label='Data de fim:' htmlFor='inputDataFim'>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
                  <DesktopDatePicker
                    inputFormat='DD/MM/YYYY'
                    value={dataFim}
                    onChange={(novaData) => setDataFim(novaData)}
                    renderInput={(params) => <TextField {...params} id='inputDataFim' size='small' fullWidth />}
                  />
                </LocalizationProvider>
              </FormGroup>
              <FormGroup label='Optante por vale-transporte:' htmlFor='inputOptanteVT'>
                <select className='form-select' id='inputOptanteVT' name='optanteVT' value={optanteVT} onChange={(e) => setOptanteVT(e.target.value)}>
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
                <button onClick={() => navigate('/listagem-contratos-trabalho')} type='button' className='btn btn-secondary'>
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

export default CadastroContratoTrabalho;
