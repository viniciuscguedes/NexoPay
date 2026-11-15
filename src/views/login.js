import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL, definirToken } from '../config/axios';

function Login() {
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/usuarios`;

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  async function entrar() {
    let data = { login, senha };
    data = JSON.stringify(data);
    await axios
      .post(`${baseURL}/auth`, data, { headers: { 'Content-Type': 'application/json' } })
      .then(function (response) {
        definirToken(response.data.token);
        mensagemSucesso('Login realizado com sucesso!');
        navigate('/listagem-folhas-pagamento');
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.status === 401 ? 'Login ou senha inválidos' : error.response && error.response.data);
      });
  }

  async function cadastrar() {
    let data = { login, senha, admin: false };
    data = JSON.stringify(data);
    await axios
      .post(baseURL, data, { headers: { 'Content-Type': 'application/json' } })
      .then(function (response) {
        mensagemSucesso('Usuário cadastrado com sucesso! Agora é só entrar.');
      })
      .catch(function (error) {
        mensagemErro(error.response && error.response.data);
      });
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <Card title='Login'>
            <div className='row'>
              <div className='col-lg-12'>
                <div className='bs-component'>
                  <FormGroup label='Login: *' htmlFor='inputLogin'>
                    <input type='text' id='inputLogin' value={login} className='form-control' name='login' onChange={(e) => setLogin(e.target.value)} />
                  </FormGroup>
                  <FormGroup label='Senha: *' htmlFor='inputSenha'>
                    <input type='password' id='inputSenha' value={senha} className='form-control' name='senha' onChange={(e) => setSenha(e.target.value)} />
                  </FormGroup>
                  <Stack spacing={1} padding={1} direction='row'>
                    <button onClick={entrar} type='button' className='btn btn-success'>
                      Entrar
                    </button>
                    <button onClick={cadastrar} type='button' className='btn btn-secondary'>
                      Cadastrar usuário
                    </button>
                  </Stack>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
