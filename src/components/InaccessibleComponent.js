import React from 'react';

function InaccessibleComponent() {
  return (
    <div>
      {/* Violação: Imagem sem alt text */}
      <img src="logo.png" />

      {/* Violação: Link sem texto descritivo */}
      <a href="/dashboard">Clique aqui</a>

      {/* Violação: Input sem label associado */}
      <input type="text" />

      {/* Violação: Botão sem texto descritivo */}
      <button>
        <span className="icon">→</span>
      </button>

      {/* Violação: Heading sem texto */}
      <h2></h2>

      {/* Violação: Elemento interativo sem role */}
      <div onClick={() => console.log('clicked')}>
        Conteúdo clicável
      </div>

      {/* Violação: Contraste insuficiente */}
      <p style={{ color: '#e0e0e0', backgroundColor: '#ffffff' }}>
        Texto com contraste baixo
      </p>

      {/* Violação: Formulário sem labels */}
      <form>
        <input type="email" />
        <input type="password" />
        <button type="submit">Enviar</button>
      </form>

      {/* Violação: Tabela sem cabeçalhos */}
      <table>
        <tr>
          <td>Dado 1</td>
          <td>Dado 2</td>
        </tr>
      </table>

      {/* Violação: Lista sem itens */}
      <ul></ul>

      {/* Violação: Elemento com role incorreto */}
      <div role="button" tabIndex={0}>
        Botão falso
      </div>
    </div>
  );
}

export default InaccessibleComponent; 