"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes, FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoImage from '../../public/Logo_da_Lacticínios_Tirol.png';
import Banner from '../banner/page';
import BlocoDeNotas from '../notas/BlocoDeNotas';
import NotasDaLoja from '../notas/NotasDaLoja';
import AddNovaValidade from '../validade/AddNovaValidade';
import styles from '../../styles/PaginaInicial.module.css';

const PaginaInicial = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeOption, setActiveOption] = useState('');
  const [showBlocoDeNotas, setShowBlocoDeNotas] = useState(false);
  const [showNotasDaLoja, setShowNotasDaLoja] = useState(false);
  const [showAddNovaValidade, setShowAddNovaValidade] = useState(false);
  const [notas, setNotas] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const sidebarRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const savedNotas = Object.keys(localStorage)
      .filter(key => key.startsWith('nota-'))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error(`Error parsing note with key ${key}:`, e);
          return null;
        }
      })
      .filter(note => note !== null);
    setNotas(savedNotas);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMenuOpen(false);
        setShowBanner(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleOptionClick = (option) => {
    setActiveOption(activeOption === option ? '' : option);
    setShowBanner(false);
  };

  const handleNotasClick = () => {
    setShowBlocoDeNotas(true);
    setMenuOpen(false);
    setShowBanner(false);
  };

  const handleNotasDaLojaClick = () => {
    setShowNotasDaLoja(true);
    setMenuOpen(false);
    setShowBanner(false);
  };

  const handleAddNovaValidadeClick = () => {
    setShowAddNovaValidade(true);
    setMenuOpen(false);
    setShowBanner(false);
  };

  const handleBackToMenu = () => {
    setShowBlocoDeNotas(false);
    setShowNotasDaLoja(false);
    setShowAddNovaValidade(false);
    setMenuOpen(true);
    setShowBanner(true);
  };

  const handleSaveNote = (note) => {
    const newId = `nota-${Date.now()}`;
    const noteWithDate = {
      id: newId,
      texto: note,
      createdAt: new Date().toLocaleString(),
    };
    localStorage.setItem(newId, JSON.stringify(noteWithDate));
    setNotas([...notas, noteWithDate]);
    handleBackToMenu();
  };

  const handleDeleteNota = (id) => {
    localStorage.removeItem(id);
    setNotas(notas.filter(nota => nota.id !== id));
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className={styles.paginaInicial}>
      <header className={styles.header}>
        <Image src={logoImage} className={styles.logo} alt="Logo" />
        <div className={styles.menuIcon} onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </header>
      <main className={styles.main}>
        {showBanner && <Banner />}
      </main>
      {menuOpen && (
        <aside className={styles.sidebar} ref={sidebarRef}>
          <div className={styles.sidebarHeader}>
            <FaUserCircle />
            <p>user@example.com</p>
          </div>
          <ul className={styles.menuOptions}>
            <li>Selecionar Roteiro (Para o Líder)</li>
            <li>Adicionar Fotos ao Banner (Para o Líder)</li>
            <li className={activeOption === 'lojas' ? styles.active : ''} onClick={() => handleOptionClick('lojas')}>
              Selecionar Lojas
              {activeOption === 'lojas' && (
                <div className={styles.storeOptions}>
                  <button>Loja 1</button>
                  <button>Loja 2</button>
                  <button>Loja 3</button>
                  <button>Loja 4</button>
                  <button>Loja 5</button>
                  <button>Adicionar Lojas (Para o Líder)</button>
                  <button>Adicionar Rede (Para o Líder)</button>
                </div>
              )}
            </li>
            <li className={activeOption === 'tarefas' ? styles.active : ''} onClick={() => handleOptionClick('tarefas')}>
              Tarefas da Loja (Para o Líder)
              {activeOption === 'tarefas' && (
                <div className={styles.taskOptions}>
                  <button>Tarefa 1(promotor vera as tarefas aqui)</button>
                  <button>Tarefa 2</button>
                  <button>Tarefa 3</button>
                  <button>Adicionar Tarefa Específica (Para o Líder)</button>
                </div>
              )}
            </li>
            <li onClick={handleNotasClick}>Notas</li>
            <li onClick={handleNotasDaLojaClick}>Notas da Loja</li>
            <li>Datas de Validade</li>
            <li onClick={handleAddNovaValidadeClick}>Adicionar Nova Validade</li>
          </ul>
          <div className={styles.footer}>
            <div className={styles.configOption} onClick={() => alert('Configurações')}>
              <FaCog /> Config
            </div>
            <div className={styles.logoutOption} onClick={handleLogout}>
              <FaSignOutAlt /> Sair
            </div>
          </div>
        </aside>
      )}
      {showBlocoDeNotas && (
        <BlocoDeNotas onBack={handleBackToMenu} onSave={handleSaveNote} />
      )}
      {showNotasDaLoja && (
        <NotasDaLoja onBack={handleBackToMenu} notas={notas} onDelete={handleDeleteNota} />
      )}
      {showAddNovaValidade && (
        <AddNovaValidade onBack={handleBackToMenu} />
      )}
    </div>

  );
};

export default PaginaInicial;
