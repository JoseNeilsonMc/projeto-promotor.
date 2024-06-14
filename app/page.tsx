"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import styles from '../styles/PaginaLogin.module.css';

const PaginaLogin = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = () => {
    setMessage('Login successful.');
    setTimeout(() => {
      router.push('/paginaInicial');
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setMessage('Registration successful');
      setTimeout(() => {
        router.push('/paginaInicial');
      }, 1000); 
    } else {
      setMessage('The passwords do not match. Please re-enter.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="Container">
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h1 className={styles.heading}>Login</h1>
        <div>
          <label htmlFor="email" className={styles.label}>Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required 
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>Senha:</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required 
          />
          <button type="button" onClick={toggleShowPassword} className={styles.showPasswordBtn}>
            {showPassword ? 'Esconder' : 'Mostrar'}
          </button>
        </div>
        <div>
          <label htmlFor="confirmPassword" className={styles.label}>Confirme a Senha:</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            id="confirmPassword" 
            name="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required 
          />
        </div>
        <button className={styles.btn} type="submit">Create an account</button>
        <div className={styles.googleLogin}>
          <button type="button" onClick={handleGoogleLogin} className={styles.btn}>
            <img src="https://w7.pngwing.com/pngs/989/129/png-transparent-google-logo-google-search-meng-meng-company-text-logo.png" className={styles.googleLogo} alt="Google Logo" />
            Login com Google
          </button>
        </div>
        {message && <p className={styles.msg}>{message}</p>}
      </form>
    </div>
  );
};

export default PaginaLogin;