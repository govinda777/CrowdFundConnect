
# TourChain - Plataforma Web3 de Viagens Corporativas

## Arquitetura do Sistema

```mermaid
graph TD
    A[Cliente Web] -->|HTTP/WebSocket| B[API Express]
    B -->|Smart Contracts| C[Blockchain]
    B -->|Cache/Estado| D[Storage]
    C -->|Eventos| B
    D -->|Queries| B
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
```

## Fluxo de Transações

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant C as Contratos
    
    U->>F: Inicia Transação
    F->>B: POST /api/pledge
    B->>C: Executa Smart Contract
    C-->>B: Confirma Transação
    B-->>F: Retorna Status
    F-->>U: Atualiza Interface
```

## Componentes do Sistema

```mermaid
stateDiagram-v2
    [*] --> Frontend
    Frontend --> API
    API --> Storage
    API --> Blockchain
    
    Frontend : React + Vite
    API : Express + TypeScript
    Storage : In-Memory DB
    Blockchain : Web3 Integration
```

## Logo SVG

<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="#e0f2fe" stroke="#0ea5e9" stroke-width="2"/>
  <path d="M30,50 L70,50 M50,30 L50,70" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="10" fill="#0ea5e9"/>
</svg>

## Tecnologias Utilizadas

- Frontend: React, Vite, TailwindCSS
- Backend: Express, TypeScript
- Blockchain: Web3.js
- Storage: In-Memory Database

## Estrutura do Projeto

```
├── client/           # Frontend React
├── server/           # Backend Express
└── shared/           # Tipos e schemas compartilhados
```

## Características Principais

- Integração Web3 completa
- Sistema de recompensas dinâmico
- Contratos inteligentes para transações
- Interface responsiva e moderna

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:5000`

## Endpoints da API

- `POST /api/pledge` - Criar nova contribuição
- `GET /api/projects` - Listar projetos
- `GET /api/rewards` - Listar recompensas

## Licença

MIT
