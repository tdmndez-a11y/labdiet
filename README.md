# AKT Diet Builder

AKT Diet Builder é um aplicativo web criado com React + Vite para apoiar nutricionistas no planejamento de dietas personalizadas. O projeto foi reorganizado em módulos independentes para facilitar a manutenção durante as sprints descritas no escopo.

## 🚀 Começando

```bash
npm install
npm run dev
```

Se o terminal retornar **`command not found: npm`**, significa que o Node.js (que já inclui o npm) não está instalado ou não foi adicionado ao `PATH`. Veja a seção [💾 Instalando Node.js e npm](#-instalando-nodejs-e-npm) para resolver.

Abra [http://localhost:5173](http://localhost:5173) no navegador para visualizar o app.

### Scripts disponíveis

- `npm run dev`: inicia o servidor de desenvolvimento com Vite.
- `npm run build`: gera a versão otimizada para produção.
- `npm run preview`: executa uma pré-visualização do build.
- `npm run lint`: executa o linter TypeScript/ESLint (quando configurado).

## 🧱 Estrutura do projeto

```
src/
├── App.tsx                # Shell principal
├── components/            # Componentes reutilizáveis (layout, formulários, feedback)
├── pages/                 # Páginas (Planos, Clientes, Banco de Dados, Configurações)
├── hooks/                 # Hooks utilitários (LocalStorage, Toasts)
├── utils/                 # Funções de suporte (macros, arquivos, constantes)
└── types/                 # Definições de tipos compartilhados
```

Os estilos globais são controlados por Tailwind CSS e variáveis CSS personalizadas para suportar o tema industrial do app.

## 🧭 Sprints

O roadmap das sprints está descrito diretamente no código base, com funcionalidades principais como templates de plano, painel de clientes e persistência local. Cada sprint pode evoluir a partir da base modular atual.

## 📦 Importação/Exportação

- O banco de alimentos aceita importação via CSV ou JSON.
- Planos podem ser exportados como JSON ou impressos (pré-visualização integrada).

## 🛠️ Requisitos

- Node.js 18+
- npm 9+

### 💾 Instalando Node.js e npm

1. **Verifique se já possui Node instalado**
   ```bash
   node -v
   npm -v
   ```
   Se ambos os comandos retornarem versões, o ambiente já está pronto.

2. **Caso receba `command not found`**, instale o Node.js (que já inclui o npm):
   - **Windows / macOS:** baixe o instalador LTS em [nodejs.org](https://nodejs.org/) e siga as etapas padrão. Após a instalação, feche e reabra o VS Code para atualizar o `PATH`.
   - **Linux:** utilize um gerenciador de versões como [nvm](https://github.com/nvm-sh/nvm). Exemplo:
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
     source ~/.nvm/nvm.sh
     nvm install --lts
     ```

3. **Reabra o VS Code** (ou o terminal) e execute novamente `npm install`.

## 📄 Licença

Projeto interno AKT Labs. Ajuste conforme a política da empresa antes de torná-lo público.
