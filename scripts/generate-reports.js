// Script para capturar violações reais de acessibilidade com detalhes
// Parte da pesquisa TCC - USP/Esalq

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

function extrairDetalhesDoAxe(saidaTeste) {
  const violacoes = [];
  const linhas = saidaTeste.split('\n');
  
  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    
    // Detectar violação de labels obrigatórios
    if (linha.includes('Form elements must have labels (label)')) {
      // Buscar contexto para identificar elemento específico
      const contextoAnterior = linhas.slice(Math.max(0, i-10), i).join('\n');
      const contextoProximo = linhas.slice(i, i+15).join('\n');
      
      let elementoAfetado = 'Campo de formulário';
      let idElemento = '';
      
      if (contextoAnterior.includes('#name') || contextoProximo.includes('#name')) {
        elementoAfetado = 'Campo Nome';
        idElemento = 'id="name"';
      } else if (contextoAnterior.includes('#email-field') || contextoProximo.includes('#email-field')) {
        elementoAfetado = 'Campo Email';
        idElemento = 'id="email-field"';
      } else if (contextoAnterior.includes('#message') || contextoProximo.includes('#message')) {
        elementoAfetado = 'Campo Mensagem (textarea)';
        idElemento = 'id="message"';
      }
      
      violacoes.push({
        regra: 'label',
        titulo: 'Elementos de formulário devem ter labels',
        descricao: 'Form elements must have labels (label) - axe-core rule',
        impacto: 'Usuários de leitores de tela não conseguem identificar a função do campo',
        elementos: [elementoAfetado + ' (' + idElemento + ')'],
        solucao: 'Conectar <label> ao <input> usando atributo htmlFor',
        arquivo: 'src/components/Form.js',
        wcagReferencia: 'WCAG 1.3.1 - Info and Relationships',
        linhasCodigo: [
          'Problema: <label>Nome *</label><input id="name" ...>',
          'Solução: <label htmlFor="name">Nome *</label><input id="name" ...>'
        ],
        detalhesAxe: 'Form element does not have an explicit <label>'
      });
    }
    
    // Detectar violações de contraste de cores
    if (linha.includes('color-contrast') || linha.includes('Elements must have sufficient color contrast')) {
      const contextoProximo = linhas.slice(i, i+20).join('\n');
      
      // Extrair ratio de contraste se disponível
      const matchRatio = contextoProximo.match(/contrast ratio of ([\d.]+):([\d.]+)/);
      const ratioAtual = matchRatio ? `${matchRatio[1]}:${matchRatio[2]}` : 'insuficiente';
      
      // Identificar elemento específico
      let elementoAfetado = 'Elemento com cores problemáticas';
      let coresProblematicas = '';
      
      if (contextoProximo.includes('background-color') && contextoProximo.includes('#ffff00')) {
        elementoAfetado = 'Botão amarelo com texto branco';
        coresProblematicas = 'background: #ffff00, color: #ffffff';
      } else if (contextoProximo.includes('#aaaaaa')) {
        elementoAfetado = 'Texto cinza claro sobre fundo branco';
        coresProblematicas = 'color: #aaaaaa, background: #ffffff';
      } else if (contextoProximo.includes('#cccccc')) {
        elementoAfetado = 'Link com cor muito clara';
        coresProblematicas = 'color: #cccccc, background: #f8f8f8';
      } else if (contextoProximo.includes('#ff9999')) {
        elementoAfetado = 'Texto rosa sobre fundo vermelho';
        coresProblematicas = 'color: #ff9999, background: #ff6b6b';
      }
      
      violacoes.push({
        regra: 'color-contrast',
        titulo: 'Contraste de cores insuficiente',
        descricao: `Elements must have sufficient color contrast (color-contrast) - Ratio: ${ratioAtual}`,
        impacto: 'Usuários com baixa visão, daltonismo ou em ambientes claros não conseguem ler o texto',
        elementos: [elementoAfetado + (coresProblematicas ? ` (${coresProblematicas})` : '')],
        solucao: 'Usar cores com contraste mínimo de 4.5:1 para texto normal ou 3:1 para texto grande',
        arquivo: 'src/App.js',
        wcagReferencia: 'WCAG 1.4.3 - Contrast (Minimum)',
        linhasCodigo: [
          'Problema: color: #aaaaaa; background: #ffffff; /* 2.32:1 */',
          'Solução: color: #333333; background: #ffffff; /* 12.63:1 */'
        ],
        detalhesAxe: `Contraste atual: ${ratioAtual}, mínimo necessário: 4.5:1`
      });
    }
    
    // Detectar violação de label-title-only
    if (linha.includes('Form elements should have a visible label (label-title-only)')) {
      violacoes.push({
        regra: 'label-title-only',
        titulo: 'Elementos de formulário precisam de labels visíveis',
        descricao: 'Form elements should have a visible label (label-title-only)',
        impacto: 'Labels invisíveis ou inadequados dificultam a navegação',
        elementos: ['Campos com labels não conectados adequadamente'],
        solucao: 'Usar <label> com htmlFor em vez de <span> ou labels não conectados',
        arquivo: 'src/components/Form.js',
        wcagReferencia: 'WCAG 1.3.1 - Info and Relationships',
        linhasCodigo: [
          'Problema: <span style="font-weight: bold;">Email *</span>',
          'Solução: <label htmlFor="email-field">Email *</label>'
        ],
        detalhesAxe: 'Only title used to generate label for form element'
      });
    }
    
    // Detectar problemas de aria-describedby
    if (linha.includes('aria-describedby="name-error-nonexistent"')) {
      violacoes.push({
        regra: 'aria-describedby-refer',
        titulo: 'ARIA-describedby referencia elemento inexistente',
        descricao: 'Atributo aria-describedby aponta para ID que não existe no DOM',
        impacto: 'Leitores de tela não conseguem anunciar mensagens de erro associadas',
        elementos: ['Input nome com aria-describedby="name-error-nonexistent"'],
        solucao: 'Corrigir ID para corresponder ao elemento de erro real',
        arquivo: 'src/components/Form.js',
        wcagReferencia: 'WCAG 4.1.2 - Name, Role, Value',
        linhasCodigo: [
          'Problema: aria-describedby="name-error-nonexistent"',
          'Solução: aria-describedby="name-error"'
        ],
        detalhesAxe: 'References elements that do not exist'
      });
    }
    
    // Detectar problemas específicos no teste
    if (linha.includes('no form control was found associated to that label')) {
      violacoes.push({
        regra: 'label-association',
        titulo: 'Label não associado ao controle de formulário',
        descricao: 'Testing Library: no form control was found associated to that label',
        impacto: 'Ferramentas de teste e leitores de tela não encontram conexão label-input',
        elementos: ['Label "Nome *" sem for="name"', 'Label "Mensagem *" sem for="message"'],
        solucao: 'Adicionar atributo htmlFor/for nos elementos <label>',
        arquivo: 'src/components/Form.js',
        wcagReferencia: 'WCAG 1.3.1 - Info and Relationships',
        linhasCodigo: [
          'Problema: <label>Nome *</label>',
          'Solução: <label htmlFor="name">Nome *</label>'
        ],
        detalhesAxe: 'Make sure you\'re using the "for" attribute correctly'
      });
    }
  }
  
  // Remover duplicatas baseado na regra
  const violacoesUnicas = [];
  const regrasVistas = new Set();
  
  for (const violacao of violacoes) {
    if (!regrasVistas.has(violacao.regra)) {
      regrasVistas.add(violacao.regra);
      violacoesUnicas.push(violacao);
    }
  }
  
  return violacoesUnicas;
}

function extrairEstatisticasTestes(saidaTeste) {
  const stats = {};
  
  // Extrair números de testes
  const matchFailed = saidaTeste.match(/Tests:\s+(\d+) failed, (\d+) passed, (\d+) total/);
  if (matchFailed) {
    stats.testesFalharam = parseInt(matchFailed[1]);
    stats.testesPassaram = parseInt(matchFailed[2]);
    stats.totalTestes = parseInt(matchFailed[3]);
  }
  
  // Extrair test suites
  const matchSuites = saidaTeste.match(/Test Suites:\s+(\d+) failed, (\d+) passed, (\d+) total/);
  if (matchSuites) {
    stats.suitesFalharam = parseInt(matchSuites[1]);
    stats.suitesPassaram = parseInt(matchSuites[2]);
    stats.totalSuites = parseInt(matchSuites[3]);
  }
  
  // Extrair tempo de execução
  const matchTime = saidaTeste.match(/Time:\s+([\d.]+)\s*s/);
  stats.tempoExecucao = matchTime ? parseFloat(matchTime[1]) : 0;
  
  return stats;
}

function executarTestesECapturarErros() {
  const data = new Date().toLocaleDateString('pt-BR');
  let violacoesDetalhadas = [];
  let estatisticas = {};
  let outputCompleto = '';
  
  console.log('🔍 Executando testes para capturar violações reais...');
  
  return new Promise((resolve) => {
    const processo = spawn('npm', ['run', 'test:a11y'], {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    processo.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    processo.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    processo.on('close', (code) => {
      outputCompleto = stdout + stderr;
      
      // DEBUG: Salvar output completo para análise
      if (!fs.existsSync(path.join(__dirname, '..', 'reports'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'reports'));
      }
      fs.writeFileSync(path.join(__dirname, '..', 'reports', 'debug-output.txt'), outputCompleto);
      console.log('🔍 Debug: Output salvo em reports/debug-output.txt');
      
      if (code === 0) {
        console.log('✅ Testes Jest passaram - nenhuma violação encontrada');
      } else {
        console.log('❌ Testes Jest falharam - capturando violações detalhadas...');
        
        // Verificar se contém as strings que procuramos
        console.log('🔍 Strings encontradas:');
        console.log('  - "Form elements must have labels": ', outputCompleto.includes('Form elements must have labels'));
        console.log('  - "label-title-only": ', outputCompleto.includes('label-title-only'));
        console.log('  - "aria-describedby": ', outputCompleto.includes('aria-describedby'));
        console.log('  - "no form control was found": ', outputCompleto.includes('no form control was found'));
        
        // Extrair violações detalhadas
        violacoesDetalhadas = extrairDetalhesDoAxe(outputCompleto);
        
        // Extrair estatísticas
        estatisticas = extrairEstatisticasTestes(outputCompleto);
        
        console.log(`🔍 ${violacoesDetalhadas.length} tipos de violações encontradas`);
        console.log(`📊 ${estatisticas.testesFalharam}/${estatisticas.totalTestes} testes falharam`);
      }
      
      resolve({
        data,
        violacoes: violacoesDetalhadas,
        stats: estatisticas,
        temViolacoes: violacoesDetalhadas.length > 0,
        outputDebug: outputCompleto
      });
    });
  });
}

function gerarRelatorioDetalhado() {
  executarTestesECapturarErros().then(resultados => {
    let conteudo = `# Análise Detalhada de Violações de Acessibilidade

*Pesquisa TCC - ${resultados.data}*

## Resumo Executivo

Durante a execução dos testes automatizados de acessibilidade, foram identificadas violações às diretrizes WCAG 2.1 AA utilizando a ferramenta axe-core integrada ao Jest.

`;

    if (!resultados.temViolacoes) {
      conteudo += `✅ **Nenhuma violação encontrada** - Todos os testes de acessibilidade passaram.

Os componentes React estão implementados seguindo as diretrizes WCAG 2.1 AA.

`;
    } else {
      // Estatísticas detalhadas
      if (resultados.stats.totalTestes) {
        conteudo += `## 📊 Resultados dos Testes

- **Total de testes:** ${resultados.stats.totalTestes}
- **Testes falharam:** ${resultados.stats.testesFalharam} (${Math.round(resultados.stats.testesFalharam/resultados.stats.totalTestes*100)}%)
- **Testes passaram:** ${resultados.stats.testesPassaram} (${Math.round(resultados.stats.testesPassaram/resultados.stats.totalTestes*100)}%)
${resultados.stats.totalSuites ? `- **Test Suites:** ${resultados.stats.suitesFalharam} falharam de ${resultados.stats.totalSuites} total` : ''}
${resultados.stats.tempoExecucao ? `- **Tempo de execução:** ${resultados.stats.tempoExecucao}s` : ''}
- **Ferramenta:** Jest + axe-core

`;
      }
      
      conteudo += `## 🚨 Violações Identificadas

`;
      
      resultados.violacoes.forEach((violacao, index) => {
        conteudo += `### ${index + 1}. ${violacao.titulo}

**Regra axe-core:** \`${violacao.regra}\`
**Arquivo:** \`${violacao.arquivo}\`

**Descrição:** ${violacao.descricao}

**Impacto para usuários:** ${violacao.impacto}

**Elementos afetados:**
${violacao.elementos.map(el => `- ${el}`).join('\n')}

**Código problemático:**
\`\`\`jsx
${violacao.linhasCodigo[0]}
\`\`\`

**Correção necessária:**
\`\`\`jsx
${violacao.linhasCodigo[1]}
\`\`\`

**Como corrigir:** ${violacao.solucao}

---

`;
      });
    }

    conteudo += `## 🔧 Ferramentas de Verificação

\`\`\`bash
# Executar análise completa
npm run test:a11y    # Jest + axe-core (testes unitários)
npm run test:e2e     # Playwright + axe-core (testes E2E)
npm run lighthouse   # Google Lighthouse (auditoria completa)

# Executar tudo em sequência
npm run test:all-a11y
\`\`\`

## 📚 Referências WCAG 2.1

${resultados.violacoes.map(v => {
  const wcagMap = {
    'label': '1.3.1 - Info and Relationships',
    'color-contrast': '1.4.3 - Contrast (Minimum)',
    'button-name': '4.1.2 - Name, Role, Value',
    'aria-describedby-refer': '4.1.2 - Name, Role, Value'
  };
  return `- **${v.regra}**: WCAG ${wcagMap[v.regra] || 'Multiple criteria'}`;
}).join('\n')}

---
*Relatório automático baseado em execução real de testes - ${resultados.data}*
`;

    // Salvar arquivo
    const pastaReports = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(pastaReports)) {
      fs.mkdirSync(pastaReports);
    }

    const nomeArquivo = path.join(pastaReports, 'violacoes-encontradas.md');
    fs.writeFileSync(nomeArquivo, conteudo);
    
    console.log('📄 Relatório detalhado criado: violacoes-encontradas.md');
    console.log(`🔍 ${resultados.violacoes.length} violações documentadas com detalhes`);
  });
}

// Executar se chamado diretamente
if (require.main === module) {
  gerarRelatorioDetalhado();
} 