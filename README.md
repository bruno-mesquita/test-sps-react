----------------------------------
ESPANHOL
----------------------------------

## PRUEBA SPS REACT

- Crear un CRUD de usuarios

## Reglas

- Crear la página de inicio de sesión (signIn) para autenticar al usuario (usar el usuario previamente registrado para validar).
- Se puede utilizar cualquier tipo de almacenamiento para guardar el token.
- Solo será posible registrar y/o visualizar usuarios si el usuario está autenticado.
- Consumir la API creada anteriormente (test-sps-server).


----------------------------------
PORTUGUÊS
----------------------------------

# SPS REACT TEST

- Criar um CRUD de usuários

# Regras

- Criar a página de signIn para fazer a autenticação do usuário (Usar o usuário previamente cadastrado para validar)
- Pode usar qualquer tipo de storage para guardar o token
- Só será possível cadastrar e/ou visualizar os usuários se estiver autenticado
- Chamar a API que foi criada anteriormente (test-sps-server)

---

# Modernização do Frontend

Após a implementação inicial do CRUD com autenticação, o projeto passou por uma etapa de modernização do stack e da interface. Todas as decisões de tecnologia e arquitetura foram tomadas pelo desenvolvedor — o Claude Code foi utilizado apenas como ferramenta auxiliar na execução, sem autonomia para escolher libs ou definir estrutura.

## O que foi feito

### Migração de CRA para Vite

O projeto saiu do Create React App (`react-scripts`) e passou a usar o **Vite 8** com o plugin oficial do React. Isso trouxe:

- Dev server significativamente mais rápido (HMR instantâneo)
- Build de produção mais enxuto
- Configuração via `vite.config.ts` com alias `@/` apontando para `src/`

### Migração de JavaScript para TypeScript

Todo o código-fonte foi migrado de `.js`/`.jsx` para `.ts`/`.tsx`, com:

- `tsconfig.json` configurado para modo estrito
- Tipagem centralizada em `src/types/index.ts`
- Tipagem dos serviços, contextos e páginas

### Adoção do shadcn/ui

A interface foi redesenhada usando **shadcn/ui**, que combina:

- **Tailwind CSS v4** (via plugin Vite, sem `tailwind.config.js`)
- **Base UI** (`@base-ui/react`) como primitivos acessíveis
- **Lucide React** para ícones
- **Geist** como fonte variável (`@fontsource-variable/geist`)

Componentes instalados: `button`, `input`, `label`, `card`, `alert`, `alert-dialog`, `badge`, `separator`, `checkbox`.

Todos os componentes ficam em `src/components/ui/` e são copiados para o projeto (filosofia do shadcn/ui: você possui o código).

### Redesign das páginas

As quatro páginas foram reescritas com a nova UI:

- **Home** — apresentação com card central
- **SignIn** — formulário de login com feedback de erro via `Alert`
- **Users** — listagem em tabela com badges de tipo (admin/user) e confirmação de exclusão via `AlertDialog`
- **UserEdit** — formulário de criação/edição com os campos `name`, `email`, `password` e `type`

### Centralização da camada HTTP

Criado `src/lib/api.ts`: instância do Axios com interceptor de request que injeta o token automaticamente. Os interceptors foram removidos do `AuthContext`, que passou a ter apenas a responsabilidade de gerenciar o estado de autenticação.

## Stack após a modernização

| Camada | Tecnologia |
|---|---|
| Bundler | Vite 8 |
| Linguagem | TypeScript 6 |
| UI | React 18 + shadcn/ui |
| Estilos | Tailwind CSS v4 |
| Roteamento | React Router v6 |
| HTTP | Axios |
| Ícones | Lucide React |
| Fonte | Geist Variable |

## Como rodar

```bash
npm install
npm start      # ou: npm run dev
```

O backend (`test-sps-server`) deve estar rodando em `http://localhost:3001`. A URL é configurável via `.env`:

```
VITE_SERVER_URL=http://localhost:3001
```
