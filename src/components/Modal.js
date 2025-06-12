import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ title, children, onClose }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    // Salvar o elemento focado antes do modal abrir
    previousFocusRef.current = document.activeElement;

    // Focar no modal quando abrir
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';

    // Cleanup ao desmontar
    return () => {
      document.body.style.overflow = '';
      // Restaurar foco ao elemento anterior
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }

    // Trap focus dentro do modal
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 id="modal-title" style={{ margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            ×
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );

  // Usar portal para renderizar o modal no body
  return createPortal(modalContent, document.body);
};

export default Modal; 