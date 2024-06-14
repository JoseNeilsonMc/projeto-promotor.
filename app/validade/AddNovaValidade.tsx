import React, { useState, useRef } from 'react';
import {
  BrowserBarcodeReader,
  BrowserQRCodeReader,
  ChecksumException,
  NotFoundException,
} from '@zxing/library';
import styles from '../../styles/AddNovaValidade.module.css';

const AddNovaValidade = ({ onBack }) => {
  const [scannedItems, setScannedItems] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const [scanning, setScanning] = useState(false);
  const scanTimeoutRef = useRef(null);
  const successMessageTimeoutRef = useRef(null);

  const startScanning = async (readerType) => {
    setError(null);
    setMessage(null);
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      codeReader.current =
        readerType === 'barcode'
          ? new BrowserBarcodeReader()
          : new BrowserQRCodeReader();
      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, error) => {
          if (result) {
            handleScanResult(result.getText(), readerType);
          } else if (error) {
            handleError(error, readerType);
          }
        }
      );

      // Clear any existing timeouts and set a new one to stop scanning after a period of inactivity
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      scanTimeoutRef.current = setTimeout(() => {
        stopScanning();
      }, 10000); // 10 seconds of inactivity
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setError('Erro ao iniciar a câmera. Verifique as permissões.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setScanning(false);
    setMessage('');
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    if (successMessageTimeoutRef.current) {
      clearTimeout(successMessageTimeoutRef.current);
    }
  };

  const handleScanResult = (data, type) => {
    const newItem = { code: data };
    if (type === 'qrcode') {
      newItem.imageUrl = 'https://via.placeholder.com/150?text=QRCode';
    }
    setScannedItems([...scannedItems, newItem]);
    setMessage(
      `${type === 'barcode' ? 'Código de Barras' : 'QR Code'} escaneado com sucesso!`
    );

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    successMessageTimeoutRef.current = setTimeout(() => {
      setMessage('');
      stopScanning();
    }, 3000); // 3 seconds to show the success message
  };

  const handleError = (error, readerType) => {
    if (readerType === 'barcode' && error instanceof ChecksumException) {
      setError('Erro ao escanear: Código de barras inválido.');
    } else if (error instanceof NotFoundException) {
      setError(null); // Não exibe erro se apenas não encontrar o código.
    } else if (
      readerType === 'qrcode' &&
      error?.message?.includes('Código de barras')
    ) {
      setError('Erro ao escanear: Detected QR code while expecting a barcode.');
    } else if (
      readerType === 'barcode' &&
      error?.message?.includes('QR Code')
    ) {
      setError('Erro ao escanear: Detected barcode while expecting a QR code.');
    } else {
      setError(`Erro ao escanear: ${error ? error.message : 'desconhecido'}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Adicionar Nova Validade</h1>
      <div className={styles.buttonContainer}>
        <button className={styles.backButton} onClick={onBack}>
          Voltar ao Menu
        </button>
        <button
          className={styles.button}
          onClick={() => startScanning('barcode')}
        >
          Iniciar leitura de Código de Barras
        </button>
        <button
          className={styles.button}
          onClick={() => startScanning('qrcode')}
        >
          Iniciar leitura de QR Code
        </button>
        {scanning && (
          <div className={styles.scannerContainer}>
            <video ref={videoRef} className={styles.video} />
            <button className={styles.button} onClick={stopScanning}>
              Parar leitura
            </button>
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
        <ul className={styles.itemList}>
          {scannedItems.length > 0 ? (
            scannedItems.map((item, index) => (
              <li key={index} className={styles.item}>
                <p>{item.code}</p>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt="Item"
                    className={styles.itemImage}
                  />
                )}
              </li>
            ))
          ) : (
            <li className={styles.item}>Nenhum item escaneado ainda.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddNovaValidade;
