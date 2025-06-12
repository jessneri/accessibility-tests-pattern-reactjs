import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Form from '../Form';

expect.extend(toHaveNoViolations);

describe('Form - Accessibility Tests', () => {
  it('should not have any accessibility violations - empty form', async () => {
    const { container } = render(<Form />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations - form with validation errors', async () => {
    const { container, getByRole } = render(<Form />);
    
    // Submeter formulário vazio para gerar erros
    const submitButton = getByRole('button', { name: /enviar formulário/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations - completed form', async () => {
    const { container, getByLabelText } = render(<Form />);
    
    // Preencher formulário
    fireEvent.change(getByLabelText(/nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(getByLabelText(/mensagem/i), { target: { value: 'Olá, esta é uma mensagem de teste.' } });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper form labels and associations', () => {
    const { getByLabelText } = render(<Form />);
    
    // Verificar se todos os campos têm labels associados
    expect(getByLabelText(/nome/i)).toBeInTheDocument();
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/mensagem/i)).toBeInTheDocument();
  });

  it('should have proper error announcements', async () => {
    const { getByRole, getAllByRole } = render(<Form />);
    
    // Submeter formulário vazio
    const submitButton = getByRole('button', { name: /enviar formulário/i });
    fireEvent.click(submitButton);

    // Verificar se os erros são anunciados com role="alert"
    await waitFor(() => {
      const alerts = getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it('should have proper aria-invalid and aria-describedby attributes', async () => {
    const { getByLabelText, getByRole } = render(<Form />);
    
    // Submeter formulário vazio para gerar erros
    const submitButton = getByRole('button', { name: /enviar formulário/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const nameInput = getByLabelText(/nome/i);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });
  });

  it('should focus on first error field when form is submitted with errors', async () => {
    const { getByLabelText, getByRole } = render(<Form />);
    
    const submitButton = getByRole('button', { name: /enviar formulário/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const nameInput = getByLabelText(/nome/i);
      expect(nameInput).toHaveFocus();
    });
  });

  it('should show success message after successful submission', async () => {
    const { getByLabelText, getByRole, getByText } = render(<Form />);
    
    // Preencher formulário
    fireEvent.change(getByLabelText(/nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(getByLabelText(/mensagem/i), { target: { value: 'Mensagem de teste' } });

    // Submeter formulário
    const submitButton = getByRole('button', { name: /enviar formulário/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText(/obrigado/i)).toBeInTheDocument();
      expect(getByRole('alert')).toBeInTheDocument();
    });
  });
}); 