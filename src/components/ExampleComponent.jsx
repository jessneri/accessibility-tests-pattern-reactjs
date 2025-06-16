import React from 'react';

function ExampleComponent() {
  return (
    <div>
      {/* Imagem sem alt text */}
      <img src="/logo.png" />

      {/* Link sem texto descritivo */}
      <a href="/dashboard">Clique aqui</a>

      {/* Input sem label */}
      <input type="text" placeholder="Digite seu nome" />

      {/* Botão sem texto descritivo */}
      <button>
        <span className="icon">→</span>
      </button>

      {/* Elemento interativo sem role */}
      <div onClick={() => console.log('clicked')}>
        Conteúdo clicável
      </div>

      {/* Formulário sem labels */}
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default ExampleComponent; 