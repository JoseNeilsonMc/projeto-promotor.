import React from 'react';
import styles from '../../styles/NotasDaLoja.module.css';

const NotasDaLoja = ({ onBack, notas, onDelete }) => {
  return (
    <div className={styles.notasDaLoja}>
      <h2 className={styles.heading}>Notas da Loja</h2>
      <ul className={styles.ul}>
        {notas.map((nota) => (
          <li key={nota.id} className={styles.li}>
            <div className={styles.notaContent}>
              <p className={styles.notaTexto}>{nota.texto}</p>
              <p className={styles.notaData}>Salvo em: {nota.createdAt}</p>
            </div>
            <button className={styles.button} onClick={() => onDelete(nota.id)}>
              Excluir
            </button>
          </li>
        ))}
        <button className={styles.button} onClick={onBack}>
          Voltar
        </button>
      </ul>
    </div>
  );
};

export default NotasDaLoja;
