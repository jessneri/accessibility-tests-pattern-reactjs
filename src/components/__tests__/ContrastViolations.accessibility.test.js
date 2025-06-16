import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../../App';

expect.extend(toHaveNoViolations);

describe('Contrast Violations - Accessibility Tests', () => {
  it('should detect color contrast violations in the app', async () => {
    const { container } = render(<App />);
    
    // Configurar axe-core para verificar especificamente contraste
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should detect insufficient contrast in custom styled elements', async () => {
    const { container } = render(
      <div>
        {/* Texto cinza claro sobre fundo branco - Contraste insuficiente */}
        <p style={{ color: '#aaaaaa', backgroundColor: '#ffffff', padding: '10px' }}>
          Texto com contraste insuficiente
        </p>
        
        {/* Botão amarelo com texto branco - Contraste péssimo */}
        <button style={{ backgroundColor: '#ffff00', color: '#ffffff', padding: '10px' }}>
          Botão problemático
        </button>
        
        {/* Link quase invisível */}
        <div style={{ backgroundColor: '#f8f8f8', padding: '10px' }}>
          <a href="#" style={{ color: '#cccccc' }}>
            Link invisível
          </a>
        </div>
      </div>
    );
    
    // Forçar verificação de contraste
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });

  it('should force contrast check with extreme example', async () => {
    const { container } = render(
      <div>
        {/* Exemplo extremo: texto branco sobre fundo amarelo claro */}
        <div style={{ 
          backgroundColor: '#ffff99', 
          color: '#ffffff',
          padding: '20px',
          fontSize: '16px'
        }}>
          Texto impossível de ler - contraste extremamente baixo
        </div>
        
        {/* Botão com contraste ruim */}
        <button style={{ 
          backgroundColor: '#ff6666', 
          color: '#ff9999',
          padding: '15px',
          border: 'none',
          fontSize: '14px'
        }}>
          Botão com contraste ruim
        </button>
      </div>
    );
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'color-contrast-enhanced': { enabled: true }
      }
    });
    
    expect(results).toHaveNoViolations();
  });

  it('should pass with adequate contrast colors', async () => {
    const { container } = render(
      <div>
        {/* Texto escuro sobre fundo claro - BOM contraste */}
        <p style={{ color: '#333333', backgroundColor: '#ffffff', padding: '10px' }}>
          Texto com contraste adequado
        </p>
        
        {/* Botão azul escuro com texto branco - EXCELENTE contraste */}
        <button style={{ backgroundColor: '#0056b3', color: '#ffffff', padding: '10px' }}>
          Botão com bom contraste
        </button>
      </div>
    );
    
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results).toHaveNoViolations();
  });
}); 