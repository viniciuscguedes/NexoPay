import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function formatarData(dataCalendario) {
  if (!dataCalendario) return '-';
  const partesData = dataCalendario.substr(0, 10).split('-');
  return partesData[2] + '/' + partesData[1] + '/' + partesData[0];
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ListagemFuncionariosBeneficios() {
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/funcionariosbeneficios`;

  const [dados, setDados] = React.useState(null);

  const cadastrar = () => {
    navigate('/cadastro-funcionarios-beneficios');
  };

  const editar = (id) => {
    navigate(`/cadastro-funcionarios-beneficios/${id}`);
  };

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(function (response) {
        mensagemSucesso('Benefício do funcionário excluído com sucesso!');
        setDados(dados.filter((dado) => dado.id !== id));
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao excluir o benefício do funcionário');
      });
  }

  React.useEffect(() => {
    axios
      .get(baseURL)
      .then((response) => {
        setDados(response.data);
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data, 'Erro ao carregar a listagem');
      });
    // eslint-disable-next-line
  }, []);

  if (!dados) return null;

  return (
    <div className='container'>
      <Card title='Benefícios dos funcionários'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button type='button' className='btn btn-warning' onClick={() => cadastrar()}>
                Novo benefício do funcionário
              </button>
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th scope='col'>Funcionário</th>
                      <th scope='col'>Benefício</th>
                      <th scope='col'>Início</th>
                      <th scope='col'>Fim</th>
                      <th scope='col'>Valor personalizado</th>
                      <th scope='col'>Ativo</th>
                      <th scope='col'>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.map((dado) => (
                      <tr key={dado.id}>
                        <td>{dado.nomeFuncionario}</td>
                        <td>{dado.nomeTipoBeneficio}</td>
                        <td>{formatarData(dado.dataInicio)}</td>
                        <td>{dado.dataFim ? formatarData(dado.dataFim) : '-'}</td>
                        <td>{dado.valorPersonalizado != null ? formatarMoeda(dado.valorPersonalizado) : '-'}</td>
                        <td>{dado.ativo === 'S' ? 'Sim' : 'Não'}</td>
                        <td>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton aria-label='edit' onClick={() => editar(dado.id)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton aria-label='delete' onClick={() => excluir(dado.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemFuncionariosBeneficios;
