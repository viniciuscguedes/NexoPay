import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';
import './App.css';
import './custom.css';
import Navbar from './components/navbar';
import Rotas from './rotas';

function App() {
  return (
    <div>
      <Navbar />
      <Rotas />
    </div>
  );
}

export default App;
