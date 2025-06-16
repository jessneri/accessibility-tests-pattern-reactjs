# Accessibility Tests Pattern - ReactJS

Este repositório faz parte da pesquisa **“Testes de Acessibilidade em aplicações React: estratégias para identificação e correção de barreiras”**, que investiga como práticas de testes automatizados e manuais podem ser aplicadas para tornar interfaces React mais acessíveis e alinhadas às diretrizes internacionais de acessibilidade digital (WCAG).

## Objetivo do Projeto

Implementar, testar e validar estratégias de acessibilidade em aplicações desenvolvidas com React, utilizando ferramentas como:

- [axe-core](https://www.deque.com/axe/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [jest-axe](https://github.com/nickcolley/jest-axe)

## Contexto Acadêmico

Este projeto está vinculado ao Trabalho de Conclusão de Curso (TCC) de especialização em Engenharia de Software pela USP/Esalq em que tem como objetivo propor uma abordagem eficaz de testes de acessibilidade, permitindo identificar e corrigir barreiras desde as fases iniciais do desenvolvimento.

A pesquisa parte da premissa de que a combinação de testes automatizados e manuais, somada a boas práticas de desenvolvimento, pode aumentar significativamente o nível de acessibilidade de interfaces digitais.


## 🚀 Início Rápido

1. **Clone e instale:**
```bash
git clone <url-do-repositorio>
cd accessibility-tests-pattern-reactjs
npm install
npx playwright install
```

2. **Execute a aplicação:**
```bash
npm start
```

3. **Execute todos os testes de acessibilidade:**
```bash
npm run test:all-a11y
```

## 🧪 Tipos de Teste

### Jest (Testes Unitários)
```bash
npm run test:a11y
```
Testa componentes isolados com **jest-axe**.

### Playwright (Testes E2E)  
```bash
npm run test:e2e
```
Testa fluxos completos com **@axe-core/playwright**.

### Lighthouse (Auditoria)
```bash
npm run lighthouse
```
Gera relatório de acessibilidade completo.

## 📁 Estrutura

```
src/
├── components/
│   ├── Button.js              # Botão acessível
│   ├── Form.js                # Formulário com validação
│   ├── Modal.js               # Modal com focus trap
│   └── __tests__/             # Testes de acessibilidade
├── App.js
└── index.js

tests/e2e/                     # Testes Playwright
scripts/lighthouse-test.js     # Script Lighthouse customizado
```

## ✅ O que é testado

- **Contraste de cores** (WCAG 2 AA)
- **Navegação por teclado** (Tab, Enter, ESC)
- **Labels e ARIA** (roles, estados)
- **Focus management** (modais, formulários)
- **Hierarquia de cabeçalhos** (H1-H6)
- **Landmarks** (header, main, nav)

## 🎯 Comandos Principais

```bash
npm start                      # Inicia aplicação
npm run test:a11y             # Testes unitários (jest-axe)
npm run test:e2e              # Testes E2E (Playwright)
npm run lighthouse            # Auditoria Lighthouse
npm run test:all-a11y         # Executa tudo
```

## 🛠️ Tecnologias

- **React** + **React Testing Library**
- **axe-core** + **jest-axe** 
- **Playwright** + **@axe-core/playwright**
- **Lighthouse** + **@lhci/cli**

## 📊 Critérios de Aprovação

- ✅ **Jest**: Zero violações de acessibilidade
- ✅ **Playwright**: Todos os fluxos funcionais
- ✅ **Lighthouse**: Score ≥ 90/100

## 🔧 Exemplos de Componentes

### Button Acessível
```jsx
<Button 
  variant="primary" 
  onClick={handleClick}
  ariaLabel="Fechar janela"
>
  Clique aqui
</Button>
```

### Form com Validação
```jsx
<Form />  // Labels associados + ARIA + mensagens de erro
```

### Modal com Focus Trap
```jsx
<Modal title="Título" onClose={handleClose}>
  Conteúdo do modal
</Modal>
```

## 📖 Recursos

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Lighthouse Accessibility](https://web.dev/accessibility-scoring/)
- [Playwright Testing](https://playwright.dev/docs/writing-tests)

---

**Todos os testes passando:** Jest (23/23) + Playwright (30/30) + Lighthouse ✅ 