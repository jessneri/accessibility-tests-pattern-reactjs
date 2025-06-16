const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');

async function measureA11yImpact() {
  const eslint = new ESLint();
  
  // Ajustando o padrão de busca para incluir todos os arquivos JavaScript
  const results = await eslint.lintFiles([
    'src/**/*.js',
    'src/**/*.jsx',
    'src/components/**/*.js',
    'src/components/**/*.jsx'
  ]);
  
  const a11yIssues = results.flatMap(result => 
    result.messages.filter(message => message.ruleId?.startsWith('jsx-a11y/'))
  );

  const issuesByRule = a11yIssues.reduce((acc, issue) => {
    acc[issue.ruleId] = (acc[issue.ruleId] || 0) + 1;
    return acc;
  }, {});

  const report = {
    totalIssues: a11yIssues.length,
    issuesByRule,
    filesAnalyzed: results.length,
    timestamp: new Date().toISOString(),
    filesWithIssues: results
      .filter(result => result.messages.some(m => m.ruleId?.startsWith('jsx-a11y/')))
      .map(result => ({
        file: result.filePath,
        issues: result.messages
          .filter(m => m.ruleId?.startsWith('jsx-a11y/'))
          .map(m => ({
            rule: m.ruleId,
            message: m.message,
            line: m.line,
            column: m.column
          }))
      }))
  };

  // Criar diretório de relatórios se não existir
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Salvar relatório JSON
  const reportPath = path.join(reportsDir, 'a11y-impact.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Gerar relatório em markdown
  const markdownReport = `# Relatório de Impacto do ESLint Plugin JSX-A11Y

## Resumo
- Total de arquivos analisados: ${report.filesAnalyzed}
- Total de problemas de acessibilidade encontrados: ${report.totalIssues}
- Data da análise: ${new Date(report.timestamp).toLocaleString()}

## Problemas por Regra
${Object.entries(report.issuesByRule)
  .map(([rule, count]) => `- ${rule}: ${count} problemas`)
  .join('\n')}

## Arquivos com Problemas
${report.filesWithIssues.map(file => `
### ${path.basename(file.file)}
${file.issues.map(issue => `- ${issue.rule}: ${issue.message} (linha ${issue.line}, coluna ${issue.column})`).join('\n')}
`).join('\n')}

## Recomendações
1. Priorizar a correção dos problemas mais frequentes
2. Revisar os componentes que violam múltiplas regras
3. Implementar testes de acessibilidade automatizados
4. Treinar a equipe sobre as regras mais violadas
`;

  fs.writeFileSync(
    path.join(reportsDir, 'a11y-impact.md'),
    markdownReport
  );

  console.log('Relatório gerado com sucesso!');
  console.log('Verifique os arquivos em:');
  console.log('- reports/a11y-impact.json');
  console.log('- reports/a11y-impact.md');
}

measureA11yImpact().catch(console.error); 