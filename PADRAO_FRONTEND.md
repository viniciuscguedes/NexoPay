# PROJECT_STANDARDS.md
> Sistema de Controle de Atividades Complementares (SCAC) — Frontend

---

## 1. Stack & Versões

| Camada | Tecnologia | Versão |
|---|---|---|
| Linguagem | JavaScript (ES6+) | — |
| Framework UI | React | ^18.2.0 |
| Roteamento | React Router DOM | ^6.6.1 |
| HTTP Client | Axios | ^1.2.2 |
| UI Components | MUI (Material UI) | ^5.11.x |
| Date Picker | @mui/x-date-pickers + dayjs | ^5.0.12 / ^1.11.7 |
| CSS Framework | Bootswatch (tema Flatly) | ^5.2.3 |
| Componentes Bootstrap | Reactstrap | ^9.1.5 |
| Notificações | toastr | ^2.1.4 |
| Gráficos | Chart.js + react-chartjs-2 | ^4.1.1 / ^5.1.0 |
| Build Tool | react-scripts (CRA) | 5.0.1 |
| Testes | @testing-library/react + jest-dom | ^13.4.0 |

**Backend esperado:** API REST em `http://localhost:8080/api/v1` (configurado em `src/config/axios.js`).

---

## 2. Arquitetura e Estrutura de Pastas

O projeto é uma **SPA (Single Page Application)** com arquitetura em camadas simples:

```
scac-app-master/
├── public/               # Arquivos estáticos (index.html, favicon, manifesto)
├── src/
│   ├── App.js            # Componente raiz: monta <Navbar> e <Rotas>
│   ├── rotas.js          # Declaração centralizada de todas as rotas (BrowserRouter + Routes)
│   ├── config/
│   │   └── axios.js      # Configuração global: exporta BASE_URL da API
│   ├── components/       # Componentes reutilizáveis / UI genérico
│   │   ├── card.js
│   │   ├── form-group.js
│   │   ├── navbar.js
│   │   ├── navbarItem.js
│   │   ├── sub-card.js
│   │   └── toastr.js
│   └── views/            # Páginas (telas) da aplicação — uma por entidade de domínio
│       ├── login.js
│       ├── cadastro-*.js      # Formulários de criação/edição (CRUD)
│       └── listagem-*.js      # Tabelas de listagem com ações (editar/excluir)
│       └── acompanhamento-*.js # Telas analíticas/dashboards
├── package.json
└── PROJECT_STANDARDS.md
```

**Responsabilidade de cada camada:**

| Diretório | Responsabilidade |
|---|---|
| `src/config/` | Constantes globais e configuração de serviços externos (URL base da API) |
| `src/components/` | Componentes presentacionais puros e reutilizáveis, sem lógica de negócio |
| `src/views/` | Páginas completas: estado local, chamadas HTTP, lógica de formulário e renderização |
| `src/rotas.js` | Mapeamento de URL → componente de view |
| `src/App.js` | Shell da aplicação: layout base + roteador |

---

## 3. Convenções de Nomenclatura

### Arquivos
- **Views (páginas):** `kebab-case` descritivo com prefixo funcional:
  - `cadastro-<entidade>.js` → formulário de cadastro/edição
  - `listagem-<entidade>.js` → tabela de listagem
  - `acompanhamento-<domínio>.js` → tela analítica/dashboard
- **Componentes:** `kebab-case` simples: `card.js`, `form-group.js`, `navbar.js`
- **Configuração:** `kebab-case`: `axios.js`

### Componentes React (classes e funções)
- **PascalCase** obrigatório, refletindo o nome do arquivo em CamelCase:
  - `cadastro-aluno.js` → `function CadastroAluno()`
  - `listagem-alunos.js` → `function ListagemAlunos()`
  - `form-group.js` → `function FormGroup()`
  - `card.js` → `class Card extends React.Component`

### Variáveis e estado
- **camelCase** para todas as variáveis de estado e funções:
  - `const [idAluno, setIdAluno] = useState(0)`
  - `const [dadosCursos, setDadosCursos] = useState(null)`
  - `const [entidadePromotora, setEntidadePromotora] = useState('')`
- Arrays de dados da API: prefixo `dados` + entidade em PascalCase → `dadosAlunos`, `dadosCursos`, `dadosCategorias`
- Objeto único da API: `dados` (singular, genérico por view)
- ID de entidade relacionada: prefixo `id` + entidade → `idAluno`, `idCurso`, `idCategoria`

### Rotas (URLs)
- Formato: `kebab-case` no plural, com parâmetro opcional `/:idParam?` para edição:
  - `/listagem-alunos`
  - `/cadastro-alunos/:idParam?`
  - `/listagem-atividades-complementares`
  - `/acompanhamento-atividades-complementares`

### Endpoints da API (Backend)
- Plural e em português sem acentos: `/api/v1/alunos`, `/api/v1/cursos`, `/api/v1/categorias`, `/api/v1/atividadescomplementares`
- Sub-recurso aninhado: `/api/v1/alunos/{id}/atividadescomplementares`

### Props de componentes
- `camelCase` seguindo o HTML semântico: `htmlFor`, `label`, `title`, `render`, `href`

---

## 4. Padrões de Implementação por Camada

### 4.1 Fluxo de Dados

Não há camada de serviço separada. As views acessam a API diretamente via Axios.  
O fluxo padrão é:

```
View (useState) ──axios──▶ API REST ──▶ setDados(response.data)
```

- O body das requisições POST/PUT é serializado via `JSON.stringify(objeto)` e enviado com header `Content-Type: application/json`.
- Não há DTOs, Mappers ou interfaces: o objeto de estado local **é** o payload enviado à API.

**Exemplo (cadastro-aluno.js):**
```js
let data = { id, matricula, nome, cpf, email, celular, idCurso };
data = JSON.stringify(data);
await axios.post(baseURL, data, { headers: { 'Content-Type': 'application/json' } });
```

### 4.2 Busca e Carregamento de Dados

- **Listagem:** `React.useEffect(() => { axios.get(baseURL).then(...) }, [])` — disparo único na montagem.
- **Formulário de edição:** múltiplos `useEffect` com dependências específicas:
  1. Um `useEffect([], [])` para carregar dados de apoio (selects de relação).
  2. Um `useEffect(buscar, [id])` para carregar o registro sendo editado quando o `id` muda.
- Guard `if (!dados) return null` impede renderização antes dos dados chegarem.

**Exemplo:**
```js
useEffect(() => {
  axios.get(`${BASE_URL}/cursos`).then((response) => {
    setDadosCursos(response.data);
  });
}, []);

useEffect(() => {
  buscar(); // eslint-disable-next-line
}, [id]);

if (!dados) return null;
if (!dadosCursos) return null;
```

### 4.3 Tratamento de Erros

Não há handler global de erros. O tratamento é **local por chamada**, via `.catch()`:

```js
.catch(function (error) {
  mensagemErro(error.response.data); // usa a mensagem retornada pelo backend
});
```

- Erros de exclusão usam string literal: `mensagemErro('Erro ao excluir o aluno')`.
- Erros de save/update usam `error.response.data` diretamente.
- **Não existe interceptor Axios** configurado; `config/axios.js` só exporta a `BASE_URL`.

### 4.4 Lógica de Formulário (Cadastro/Edição)

Toda view de cadastro segue o mesmo template:

| Função | Responsabilidade |
|---|---|
| `inicializar()` | Reseta ou preenche o estado local (detecta se é criação ou edição via `idParam`) |
| `buscar()` | Faz GET no backend e popula o estado local com os dados do registro |
| `salvar()` | Faz POST (criação) ou PUT (edição), exibe toast e navega para a listagem |

- Detecção de criação vs. edição: `if (idParam == null)` (comparação com `==`, não `===`).
- Após save com sucesso: `navigate('/listagem-<entidade>')`.

### 4.5 Atualização Otimista de UI (Listagem)

Após exclusão bem-sucedida, a lista local é filtrada **sem** recarregar a API:

```js
setDados(dados.filter((dado) => dado.id !== id));
```

---

## 5. Padrões de Código & Estilo

### Estilo de componentes
- **Componentes de página (views):** predominantemente **Function Components** com hooks (`useState`, `useEffect`).
- **Componentes reutilizáveis simples:** mistura de **Class Components** (`Card`, `Login`) e **Function Components** (`FormGroup`, `Navbar`, `NavbarItem`).
- Novo código deve adotar **Function Components + Hooks** (padrão moderno já majoritário).

### Importações
Ordem observada nas views:
1. React e hooks
2. React Router (useNavigate, useParams)
3. MUI components
4. Componentes internos de `components/`
5. CSS (`../custom.css`)
6. Axios + BASE_URL

### CSS e classes
- Classes Bootstrap via string literal: `'form-control'`, `'btn btn-success'`, `'btn btn-danger'`, `'table table-hover'`, `'col-lg-12'`
- MUI `Stack` para agrupamento de botões: `<Stack spacing={1} padding={1} direction='row'>`
- MUI `IconButton` com `EditIcon` e `DeleteIcon` para ações nas tabelas de listagem.
- Tema Bootstrap: **Bootswatch Flatly** importado em `App.js`.

### Notificações (Toastr)
Funções centralizadas em `src/components/toastr.js`:

```js
mensagemSucesso('Texto de sucesso'); // toast verde, título "Sucesso"
mensagemErro('Texto de erro');       // toast vermelho, título "Erro"
mensagemAlert('Texto de alerta');    // toast amarelo, título "Alerta"
```

### Datas
- Componente: `DesktopDatePicker` do MUI com `AdapterDayjs` e locale `pt-br`.
- Formato de exibição: `DD/MM/YYYY`.
- Função de formatação manual para dados vindos da API:
  ```js
  function formatarData(dataCalendario) {
    const partesData = dataCalendario.substr(0, 10).split('-');
    return partesData[2] + '/' + partesData[1] + '/' + partesData[0];
  }
  ```

### Gráficos (Dashboard)
- Importar e registrar elementos ChartJS explicitamente via `ChartJS.register(...)`.
- Usar componentes `Bar` e `Doughnut` do `react-chartjs-2`.
- Cores geradas aleatoriamente para datasets dinâmicos (por categoria).

### Logs de debug
- `console.log(url)` presente em `listagem-alunos.js` — **deve ser removido** em produção.

---

## 6. Regras de Ouro (Do's & Don'ts)

### ✅ DEVE FAZER

- **Criar views seguindo o par `cadastro-<entidade>.js` / `listagem-<entidade>.js`** para cada nova entidade de domínio.
- **Registrar as novas rotas em `src/rotas.js`** com o padrão `/cadastro-<entidade>/:idParam?` e `/listagem-<entidade>`.
- **Adicionar o link da nova entidade em `src/components/navbar.js`** via `<NavbarItem>`.
- **Usar `const baseURL = \`${BASE_URL}/<entidade>\``** dentro da view para construir a URL do recurso.
- **Usar `useState` e `useEffect`** para todo gerenciamento de estado e side effects em novas views.
- **Sempre usar `mensagemSucesso` e `mensagemErro`** do `src/components/toastr.js` para feedback ao usuário — nunca `alert()` ou `console.error()`.
- **Envolver o conteúdo da view em `<Card title='...'>`** e usar `<FormGroup label='...' htmlFor='...'>` para cada campo de formulário.
- **Usar MUI `Stack direction='row'`** para agrupar botões de ação (Salvar/Cancelar).
- **Usar MUI `IconButton` com `EditIcon`/`DeleteIcon`** nas colunas de ação das tabelas de listagem.
- **Usar `className` em JSX** (nunca `class`, exceto onde já existe como legado em selects da view de atividade).
- **Verificar `if (!dados) return null`** antes de renderizar qualquer view que dependa de dados assíncronos.
- **Navegar com `useNavigate()`** após operações de save/delete — nunca com `window.location`.
- **Usar `key={dado.id}`** ao mapear listas renderizadas no JSX.

### ❌ NÃO DEVE FAZER

- **Não criar camadas de service, repository ou store** (Redux, Context, etc.) — a arquitetura atual é flat, chamadas HTTP diretas nas views.
- **Não usar `fetch` nativo** — apenas Axios.
- **Não criar interceptors Axios** sem revisar o impacto global no `config/axios.js`.
- **Não fazer requisições HTTP fora de `useEffect` ou funções de evento** (evitar requisições no corpo do componente sem controle de ciclo de vida).
- **Não usar comparação estrita `===` para checar `idParam`** — o projeto usa `== null` (cobre `undefined` e `null`).
- **Não criar componentes de estilo ou CSS-in-JS** — usar classes Bootstrap/Bootswatch e MUI props.
- **Não usar `React.Component` para novas views** — usar Function Components com hooks.
- **Não deixar `console.log` em código de produção** — remover antes do commit.
- **Não adicionar validações de formulário no frontend** — a validação atual é feita pelo backend, e o erro é exibido via `mensagemErro(error.response.data)`.
- **Não criar arquivos CSS por componente** — o projeto usa apenas `App.css`, `index.css` e `custom.css` globais.
- **Não usar `class` em vez de `className` em novos componentes JSX** (já existe como bug legado em alguns `<select>`, não replicar).
- **Não mudar o tema Bootstrap** — o projeto usa exclusivamente `bootswatch/dist/flatly/bootstrap.css`.

