const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouseTest() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });
  
  const options = {
    logLevel: 'info',
    output: ['json', 'html'],
    onlyCategories: ['accessibility'],
    port: chrome.port,
  };
  
  const config = {
    extends: 'lighthouse:default',
    settings: {
      onlyAudits: [
        'accessibility',
        'color-contrast',
        'document-title',
        'html-has-lang',
        'image-alt',
        'label',
        'link-name',
        'list',
        'meta-description',
        'object-alt',
        'tabindex',
        'td-headers-attr',
        'th-has-data-cells',
        'valid-lang',
        'video-caption',
        'video-description',
        'button-name',
        'bypass',
        'definition-list',
        'dlitem',
        'duplicate-id-active',
        'duplicate-id-aria',
        'form-field-multiple-labels',
        'frame-title',
        'heading-order',
        'input-image-alt',
        'landmark-one-main',
        'link-in-text-block',
        'listitem',
        'meta-refresh',
        'meta-viewport',
        'select-name',
        'skip-link',
        'use-landmarks',
      ],
    },
  };

  try {
    console.log('🚀 Iniciando análise de acessibilidade com Lighthouse...');
    
    const runnerResult = await lighthouse('http://localhost:3000', options, config);
    
    // Salvar relatórios
    const reportsDir = path.join(__dirname, '..', 'lighthouse-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Salvar relatório HTML
    const htmlReport = runnerResult.report[1];
    fs.writeFileSync(
      path.join(reportsDir, `accessibility-report-${timestamp}.html`),
      htmlReport
    );
    
    // Salvar relatório JSON
    const jsonReport = runnerResult.report[0];
    fs.writeFileSync(
      path.join(reportsDir, `accessibility-report-${timestamp}.json`),
      jsonReport
    );
    
    // Análise dos resultados
    const lhr = runnerResult.lhr;
    const accessibilityScore = lhr.categories.accessibility.score * 100;
    
    console.log(`\n📊 Pontuação de Acessibilidade: ${accessibilityScore}/100`);
    
    // Mostrar auditorias que falharam
    const failedAudits = Object.entries(lhr.audits)
      .filter(([, audit]) => audit.score !== null && audit.score < 1)
      .map(([auditId, audit]) => ({
        id: auditId,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        details: audit.details
      }));
    
    if (failedAudits.length > 0) {
      console.log('\n❌ Auditorias de acessibilidade que falharam:');
      failedAudits.forEach(audit => {
        console.log(`\n• ${audit.title} (Score: ${audit.score})`);
        console.log(`  ${audit.description}`);
        
        if (audit.details && audit.details.items) {
          console.log('  Elementos afetados:');
          audit.details.items.slice(0, 3).forEach(item => {
            if (item.node && item.node.snippet) {
              console.log(`    - ${item.node.snippet}`);
            }
          });
        }
      });
    } else {
      console.log('\n✅ Todas as auditorias de acessibilidade passaram!');
    }
    
    // Mostrar auditorias que passaram
    const passedAudits = Object.entries(lhr.audits)
      .filter(([, audit]) => audit.score === 1)
      .length;
    
    console.log(`\n✅ ${passedAudits} auditorias de acessibilidade passaram`);
    console.log(`❌ ${failedAudits.length} auditorias de acessibilidade falharam`);
    
    console.log(`\n📄 Relatórios salvos em: ${reportsDir}`);
    console.log(`   - HTML: accessibility-report-${timestamp}.html`);
    console.log(`   - JSON: accessibility-report-${timestamp}.json`);
    
    // Definir critério de sucesso (por exemplo, score >= 90)
    const minScore = 90;
    if (accessibilityScore >= minScore) {
      console.log(`\n🎉 SUCESSO: Score de acessibilidade (${accessibilityScore}) atende ao critério mínimo (${minScore})`);
      process.exit(0);
    } else {
      console.log(`\n⚠️  ATENÇÃO: Score de acessibilidade (${accessibilityScore}) está abaixo do critério mínimo (${minScore})`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar Lighthouse:', error);
    process.exit(1);
  } finally {
    await chrome.kill();
  }
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

async function main() {
  console.log('🔍 Verificando se o servidor está rodando...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Servidor não está rodando em http://localhost:3000');
    console.log('Execute: npm start');
    process.exit(1);
  }
  
  console.log('✅ Servidor encontrado, iniciando testes...');
  await runLighthouseTest();
}

main(); 