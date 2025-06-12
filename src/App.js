import React from 'react';
import Button from './components/Button';
import Form from './components/Form';
import Modal from './components/Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="container">
      <header>
        <h1>Testes de Acessibilidade em React</h1>
        <p>
          Este projeto demonstra como implementar e testar acessibilidade 
          em componentes React usando axe-core e Lighthouse.
        </p>
      </header>

      <main>
        <section aria-labelledby="buttons-section">
          <h2 id="buttons-section">Botões</h2>
          <Button variant="primary">Botão Primário</Button>
          <Button variant="secondary">Botão Secundário</Button>
          <Button 
            variant="primary" 
            onClick={() => setIsModalOpen(true)}
            aria-describedby="modal-description"
          >
            Abrir Modal
          </Button>
          <p id="modal-description">
            Este botão abre um modal de exemplo para testar acessibilidade
          </p>
        </section>

        <section aria-labelledby="form-section">
          <h2 id="form-section">Formulário</h2>
          <Form />
        </section>

        {isModalOpen && (
          <Modal 
            title="Modal de Exemplo"
            onClose={() => setIsModalOpen(false)}
          >
            <p>Este é um modal acessível para demonstração.</p>
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Fechar
            </Button>
          </Modal>
        )}
      </main>
    </div>
  );
}

export default App; 