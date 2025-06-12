import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Modal from '../Modal';

expect.extend(toHaveNoViolations);

describe('Modal - Accessibility Tests', () => {
  it('should not have any accessibility violations', async () => {
    const mockOnClose = jest.fn();
    const { container } = render(
      <Modal title="Teste Modal" onClose={mockOnClose}>
        <p>Conteúdo do modal para teste</p>
        <button>Botão de Teste</button>
      </Modal>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper dialog role and aria attributes', () => {
    const mockOnClose = jest.fn();
    const { getByRole } = render(
      <Modal title="Modal de Teste" onClose={mockOnClose}>
        <p>Conteúdo do modal</p>
      </Modal>
    );

    const dialog = getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should have proper title association', () => {
    const mockOnClose = jest.fn();
    const { getByRole } = render(
      <Modal title="Título do Modal" onClose={mockOnClose}>
        <p>Conteúdo</p>
      </Modal>
    );

    const dialog = getByRole('dialog');
    const title = document.getElementById('modal-title');
    
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Título do Modal');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should close modal when Escape key is pressed', () => {
    const mockOnClose = jest.fn();
    const { getByRole } = render(
      <Modal title="Modal Teste" onClose={mockOnClose}>
        <p>Conteúdo</p>
      </Modal>
    );

    const dialog = getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should close modal when close button is clicked', () => {
    const mockOnClose = jest.fn();
    const { getByLabelText } = render(
      <Modal title="Modal Teste" onClose={mockOnClose}>
        <p>Conteúdo</p>
      </Modal>
    );

    const closeButton = getByLabelText('Fechar modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should close modal when backdrop is clicked', () => {
    const mockOnClose = jest.fn();
    const { container } = render(
      <Modal title="Modal Teste" onClose={mockOnClose}>
        <p>Conteúdo</p>
      </Modal>
    );

    const backdrop = container.querySelector('.modal-backdrop');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close modal when modal content is clicked', () => {
    const mockOnClose = jest.fn();
    const { getByRole } = render(
      <Modal title="Modal Teste" onClose={mockOnClose}>
        <p>Conteúdo do modal que não deve fechar ao clicar</p>
      </Modal>
    );

    const dialog = getByRole('dialog');
    fireEvent.click(dialog);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should trap focus within modal', () => {
    const mockOnClose = jest.fn();
    const { getByRole, getByText, getByLabelText } = render(
      <Modal title="Modal com Foco" onClose={mockOnClose}>
        <button>Primeiro Botão</button>
        <button>Segundo Botão</button>
      </Modal>
    );

    const dialog = getByRole('dialog');
    const firstButton = getByText('Primeiro Botão');
    const closeButton = getByLabelText('Fechar modal');

    // Simular Tab no último elemento focável (botão fechar)
    closeButton.focus();
    fireEvent.keyDown(dialog, { key: 'Tab' });
    
    // Deve focar no primeiro elemento
    expect(firstButton).toHaveFocus();
  });

  it('should handle reverse tab (Shift+Tab) correctly', () => {
    const mockOnClose = jest.fn();
    const { getByRole, getByText, getByLabelText } = render(
      <Modal title="Modal com Foco" onClose={mockOnClose}>
        <button>Primeiro Botão</button>
        <button>Segundo Botão</button>
      </Modal>
    );

    const dialog = getByRole('dialog');
    const firstButton = getByText('Primeiro Botão');
    const closeButton = getByLabelText('Fechar modal');

    // Simular Shift+Tab no primeiro elemento focável
    firstButton.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    
    // Deve focar no último elemento
    expect(closeButton).toHaveFocus();
  });
}); 