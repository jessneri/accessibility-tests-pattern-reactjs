const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not have any accessibility violations on homepage', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations when interacting with buttons', async ({ page }) => {
    // Clicar no botão primário
    await page.click('text=Botão Primário');
    
    // Verificar acessibilidade após interação
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations with modal open', async ({ page }) => {
    // Abrir modal
    await page.click('text=Abrir Modal');
    
    // Verificar se modal está visível
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Verificar acessibilidade com modal aberto
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations when form has validation errors', async ({ page }) => {
    // Tentar submeter formulário vazio
    await page.click('text=Enviar Formulário');
    
    // Aguardar mensagens de erro aparecerem
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
    
    // Verificar acessibilidade com erros de validação
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations when form is completed', async ({ page }) => {
    // Preencher formulário
    await page.fill('input[name="name"]', 'João Silva');
    await page.fill('input[name="email"]', 'joao@exemplo.com');
    await page.fill('textarea[name="message"]', 'Esta é uma mensagem de teste para verificar a acessibilidade.');
    
    // Submeter formulário
    await page.click('text=Enviar Formulário');
    
    // Aguardar mensagem de sucesso
    await expect(page.locator('text=Obrigado!')).toBeVisible();
    
    // Verificar acessibilidade após submit bem-sucedido
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    // Testar navegação por Tab
    await page.keyboard.press('Tab'); // Primeiro botão
    await page.keyboard.press('Tab'); // Segundo botão
    await page.keyboard.press('Tab'); // Botão abrir modal
    await page.keyboard.press('Tab'); // Campo nome do formulário
    
    // Verificar se o foco está no campo nome
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('name', 'name');
    
    // Verificar acessibilidade durante navegação por teclado
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should handle modal keyboard interactions properly', async ({ page }) => {
    // Abrir modal
    await page.click('text=Abrir Modal');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Testar fechamento com Escape
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // Abrir modal novamente
    await page.click('text=Abrir Modal');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Testar navegação por Tab dentro do modal
    await page.keyboard.press('Tab'); // Botão Fechar dentro do modal
    await page.keyboard.press('Tab'); // Botão X de fechar
    
    // Verificar acessibilidade durante interações de teclado no modal
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper color contrast', async ({ page }) => {
    // Executar teste específico de contraste de cores
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include(['body'])
      .analyze();

    // Verificar especificamente violações de contraste
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });

  test('should have proper headings hierarchy', async ({ page }) => {
    // Verificar hierarquia de cabeçalhos
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    
    expect(h1Count).toBe(1); // Deve ter exatamente um H1
    expect(h2Count).toBeGreaterThan(0); // Deve ter pelo menos um H2
    
    // Verificar acessibilidade da estrutura de cabeçalhos
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper landmarks and regions', async ({ page }) => {
    // Verificar se existem landmarks apropriados
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    
    // Verificar acessibilidade dos landmarks
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(['landmark-one-main', 'region'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}); 