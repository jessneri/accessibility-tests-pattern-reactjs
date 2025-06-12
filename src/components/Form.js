import React, { useState } from 'react';
import Button from './Button';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Formulário enviado:', formData);
    } else {
      setErrors(newErrors);
      // Focar no primeiro campo com erro
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();
    }
  };

  if (submitted) {
    return (
      <div role="alert" aria-live="polite">
        <h3>Obrigado!</h3>
        <p>Seu formulário foi enviado com sucesso.</p>
        <Button onClick={() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', message: '' });
        }}>
          Enviar outro formulário
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">
          Nome *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={errors.name ? 'true' : 'false'}
          required
        />
        {errors.name && (
          <div id="name-error" role="alert" style={{ color: 'red', fontSize: '14px' }}>
            {errors.name}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={errors.email ? 'true' : 'false'}
          required
        />
        {errors.email && (
          <div id="email-error" role="alert" style={{ color: 'red', fontSize: '14px' }}>
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">
          Mensagem *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={errors.message ? 'true' : 'false'}
          required
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        {errors.message && (
          <div id="message-error" role="alert" style={{ color: 'red', fontSize: '14px' }}>
            {errors.message}
          </div>
        )}
      </div>

      <Button type="submit" variant="primary">
        Enviar Formulário
      </Button>
    </form>
  );
};

export default Form; 