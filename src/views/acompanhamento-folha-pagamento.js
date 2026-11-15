import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Card from '../components/card';
import SubCard from '../components/sub-card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function gerarCores(quantidade) {
  const cores = [];
  for (let i = 0; i < quantidade; i++) {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    cores.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
  }
  return cores;
}

function classeStatus(status) {
  if (status === 'FECHADA') return 'badge bg-success';
  if (status === 'CALCULADA') return 'badge bg-info';
  return 'badge bg-warning';
}

function AcompanhamentoFolhaPagamento() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/folhaspagamento`;

  const [dados, setDados] = useState(null);
  const [dadosItens, setDadosItens] = useState(null);

  const coresItens = useMemo(() => gerarCores(dadosItens ? dadosItens.length : 0), [dadosItens]);

  async function calcular() {
    await axios
      .post(`${baseURL}/${idParam}/calcular`)
      .then(function (response) {
        setDadosItens(response.data);
        setDados({ ...dados, status: 'CALCULADA' });
        mensagemSucesso('Folha calculada com sucesso!');
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data);
      });
  }

  async function fechar() {
    await axios
      .post(`${baseURL}/${idParam}/fechar`)
      .then(function (response) {
        setDados(response.data);
        mensagemSucesso('Folha fechada com sucesso!');
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data);
      });
  }

  useEffect(() => {
    axios
      .get(`${baseURL}/${idParam}`)
      .then((response) => {
        setDados(response.data);
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao carregar a folha de pagamento');
      });
    axios
      .get(`${baseURL}/${idParam}/itens`)
      .then((response) => {
        setDadosItens(response.data);
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao carregar os itens da folha');
      });
    // eslint-disable-next-line
  }, [idParam]);

  if (!dados) return null;
  if (!dadosItens) return null;

  const total = (campo) => dadosItens.reduce((soma, item) => soma + Number(item[campo] || 0), 0);
  const nomes = dadosItens.map((item) => item.nomeFuncionario);

  const dadosBar = {
    labels: nomes,
    datasets: [
      { label: 'Salário bruto', data: dadosItens.map((item) => item.salarioBruto), backgroundColor: 'rgba(44, 62, 80, 0.7)' },
      { label: 'Salário líquido', data: dadosItens.map((item) => item.salarioLiquido), backgroundColor: 'rgba(24, 188, 156, 0.7)' },
    ],
  };

  const dadosDoughnut = {
    labels: nomes,
    datasets: [{ label: 'Salário líquido', data: dadosItens.map((item) => item.salarioLiquido), backgroundColor: coresItens }],
  };

  return (
    <div className='container'>
      <Card title={`Folha ${dados.mesReferencia}/${dados.anoReferencia} - ${dados.nomeEmpresa}`}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <p>
                Status: <span className={classeStatus(dados.status)}>{dados.status}</span>
              </p>
              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={calcular} type='button' className='btn btn-primary' disabled={dados.status === 'FECHADA'}>
                  Calcular folha
                </button>
                <button onClick={fechar} type='button' className='btn btn-success' disabled={dados.status !== 'CALCULADA'}>
                  Fechar folha
                </button>
                <button onClick={() => navigate('/listagem-folhas-pagamento')} type='button' className='btn btn-secondary'>
                  Voltar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>

      <SubCard title='Itens da folha'>
        {dadosItens.length === 0 ? (
          <p>Nenhum item calculado. Clique em &quot;Calcular folha&quot;.</p>
        ) : (
          <div className='table-responsive'>
            <table className='table table-hover table-sm'>
              <thead>
                <tr>
                  <th scope='col'>Funcionário</th>
                  <th scope='col'>Dias</th>
                  <th scope='col'>Faltas</th>
                  <th scope='col'>Horas extras</th>
                  <th scope='col'>Noturno</th>
                  <th scope='col'>Risco</th>
                  <th scope='col'>Bônus</th>
                  <th scope='col'>Bruto</th>
                  <th scope='col'>INSS</th>
                  <th scope='col'>IRRF</th>
                  <th scope='col'>VT</th>
                  <th scope='col'>Líquido</th>
                  <th scope='col'>Benefícios</th>
                </tr>
              </thead>
              <tbody>
                {dadosItens.map((dado) => (
                  <tr key={dado.id}>
                    <td>{dado.nomeFuncionario}</td>
                    <td>{dado.diasTrabalhados}</td>
                    <td>{dado.faltas}</td>
                    <td>{formatarMoeda(dado.horasExtras)}</td>
                    <td>{formatarMoeda(dado.adicionaisNoturno)}</td>
                    <td>{formatarMoeda(dado.adicionaisPericulosidade)}</td>
                    <td>{formatarMoeda(dado.bonusAssiduidade)}</td>
                    <td>{formatarMoeda(dado.salarioBruto)}</td>
                    <td>{formatarMoeda(dado.descontoINSS)}</td>
                    <td>{formatarMoeda(dado.descontoIRRF)}</td>
                    <td>{formatarMoeda(dado.descontoVT)}</td>
                    <td>
                      <strong>{formatarMoeda(dado.salarioLiquido)}</strong>
                    </td>
                    <td>{formatarMoeda(dado.totalBeneficios)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='table-active'>
                  <th scope='row'>Total</th>
                  <th></th>
                  <th></th>
                  <th>{formatarMoeda(total('horasExtras'))}</th>
                  <th>{formatarMoeda(total('adicionaisNoturno'))}</th>
                  <th>{formatarMoeda(total('adicionaisPericulosidade'))}</th>
                  <th>{formatarMoeda(total('bonusAssiduidade'))}</th>
                  <th>{formatarMoeda(total('salarioBruto'))}</th>
                  <th>{formatarMoeda(total('descontoINSS'))}</th>
                  <th>{formatarMoeda(total('descontoIRRF'))}</th>
                  <th>{formatarMoeda(total('descontoVT'))}</th>
                  <th>{formatarMoeda(total('salarioLiquido'))}</th>
                  <th>{formatarMoeda(total('totalBeneficios'))}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </SubCard>

      {dadosItens.length > 0 && (
        <div className='row'>
          <div className='col-lg-8'>
            <SubCard title='Bruto x líquido por funcionário'>
              <Bar data={dadosBar} />
            </SubCard>
          </div>
          <div className='col-lg-4'>
            <SubCard title='Distribuição do líquido'>
              <Doughnut data={dadosDoughnut} />
            </SubCard>
          </div>
        </div>
      )}
    </div>
  );
}

export default AcompanhamentoFolhaPagamento;
