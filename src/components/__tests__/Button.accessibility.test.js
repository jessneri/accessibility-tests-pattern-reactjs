import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from '../Button';

expect.extend(toHaveNoViolations);

describe('Button - Accessibility Tests', () => {
  it('should not have any accessibility violations - primary button', async () => {
    const { container } = render(
      <Button variant="primary">Clique aqui</Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations - disabled button', async () => {
    const { container } = render(
      <Button variant="primary" disabled>
        Botão Desabilitado
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations - button with aria-label', async () => {
    const { container } = render(
      <Button variant="secondary" ariaLabel="Fechar janela">
        ×
      </Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations - button with aria-describedby', async () => {
    const { container } = render(
      <div>
        <Button variant="primary" ariaDescribedBy="help-text">
          Enviar
        </Button>
        <div id="help-text">Este botão enviará o formulário</div>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should be focusable and have correct role', () => {
    const { getByRole } = render(
      <Button variant="primary">Teste</Button>
    );
    
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute('disabled');
  });

  it('should be properly disabled when disabled prop is true', () => {
    const { getByRole } = render(
      <Button variant="primary" disabled>
        Desabilitado
      </Button>
    );
    
    const button = getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });
}); 