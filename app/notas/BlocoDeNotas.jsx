import React, { useState } from 'react';
import styles from '../../styles/BlocoDeNotas.module.css';

const BlocoDeNotas = ({ onBack, onSave }) => {
  const [texto, setTexto] = useState('');

  const handleSave = () => {
    onSave(texto);
    setTexto('');
  };

  return (
    <div className={styles.blocoDeNotas}>
      <h2>Bloco de Notas</h2>
      <textarea
        className={styles.textarea}
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Escreva sua nota aqui..."
      />
      <button className={styles.button} onClick={handleSave}>
        Salvar
      </button>
      <button className={styles.button} onClick={onBack}>
        Voltar
      </button>
    </div>
  );
};

export default BlocoDeNotas;
