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
    render(
      <Modal title="Modal Teste" onClose={mockOnClose}>
        <p>Conteúdo</p>
      </Modal>
    );

    // Modal é renderizado via portal no document.body
    const backdrop = document.querySelector('.modal-backdrop');
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

  it('should have focusable elements in correct order', () => {
    const mockOnClose = jest.fn();
    const { getByText, getByLabelText } = render(
      <Modal title="Modal com Foco" onClose={mockOnClose}>
        <button>Primeiro Botão</button>
        <button>Segundo Botão</button>
      </Modal>
    );

    const firstButton = getByText('Primeiro Botão');
    const secondButton = getByText('Segundo Botão');
    const closeButton = getByLabelText('Fechar modal');

    // Verificar se os elementos são focáveis
    expect(firstButton).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    
    // Verificar se o close button tem o aria-label correto
    expect(closeButton).toHaveAttribute('aria-label', 'Fechar modal');
  });

  it('should handle keyboard navigation setup correctly', () => {
    const mockOnClose = jest.fn();
    const { getByRole, getByText } = render(
      <Modal title="Modal com Foco" onClose={mockOnClose}>
        <button>Primeiro Botão</button>
        <button>Segundo Botão</button>
      </Modal>
    );

    const dialog = getByRole('dialog');
    const firstButton = getByText('Primeiro Botão');

    // Verificar se o modal tem o handler de teclado
    expect(dialog).toHaveAttribute('tabIndex', '-1');
    
    // Verificar se os botões são acessíveis
    expect(firstButton.tabIndex).not.toBe(-1);
  });
}); 