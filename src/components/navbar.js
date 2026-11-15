import React from 'react';
import NavbarItem from './navbarItem';
import { limparToken } from '../config/axios';

function Navbar() {
  return (
    <div className='navbar navbar-expand-lg sticky-top navbar-dark bg-primary'>
      <div className='container'>
        <a href='/listagem-folhas-pagamento' className='navbar-brand'>
          NexoPay
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarResponsive'
          aria-controls='navbarResponsive'
          aria-expanded='false'
          aria-label='Alternar navegação'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          <ul className='navbar-nav me-auto'>
          <li className='nav-item dropdown'>
            <a className='nav-link dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>Estrutura</a>
            <ul className='dropdown-menu'>
              <NavbarItem href='/listagem-empresas' label='Empresas' dropdown={true} />
              <NavbarItem href='/listagem-departamentos' label='Departamentos' dropdown={true} />
              <NavbarItem href='/listagem-cargos' label='Cargos' dropdown={true} />
            </ul>
          </li>
          <li className='nav-item dropdown'>
            <a className='nav-link dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>Pessoas</a>
            <ul className='dropdown-menu'>
              <NavbarItem href='/listagem-funcionarios' label='Funcionários' dropdown={true} />
              <NavbarItem href='/listagem-dependentes' label='Dependentes' dropdown={true} />
              <NavbarItem href='/listagem-contratos-trabalho' label='Contratos de trabalho' dropdown={true} />
            </ul>
          </li>
          <li className='nav-item dropdown'>
            <a className='nav-link dropdown-toggle' href='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'>Folha</a>
            <ul className='dropdown-menu'>
              <NavbarItem href='/listagem-folhas-pagamento' label='Folhas de pagamento' dropdown={true} />
              <NavbarItem href='/listagem-registros-ponto' label='Registros de ponto' dropdown={true} />
              <NavbarItem href='/listagem-tipos-beneficio' label='Tipos de benefício' dropdown={true} />
              <NavbarItem href='/listagem-funcionarios-beneficios' label='Benefícios dos funcionários' dropdown={true} />
            </ul>
          </li>
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem href='/login' label='Sair' onClick={limparToken} />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
