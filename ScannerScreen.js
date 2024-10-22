//Importar bibliotecas
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import CameraScanner from './CameraScanner';
import './ScannerScreen.css';

//agregar constantes de proyectos 
const ScannerScreen = () => {
    const [text, setText] = useState('Not yet scanned');
    const [isEntrada, setIsEntrada] = useState(false);
    const [isSalida, setIsSalida] = useState(false);
    const [location, setLocation] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            setLocation({ latitude, longitude });
                        },
                        (error) => {
                            console.error('Error obteniendo la ubicación:', error);
                            alert('Error obteniendo la ubicación');
                        }
                    );
                } else {
                    alert('La geolocalización no es soportada por este navegador.');
                }
            } catch (err) {
                console.error('No se pudo acceder a la cámara:', err);
                alert('No se pudo acceder a la cámara: ' + err.message);
            }
        };

        requestPermissions();
    }, []);

    const handleScan = (decodedText) => {
        if (decodedText) {
            if (!isEntrada && !isSalida) {
                alert('Por favor, selecciona entrada o salida antes de escanear');
                return;
            }

            const action = isEntrada ? 'entrada' : 'salida';
            try {
                const qrData = JSON.parse(decodedText);
                const localTimestamp = moment().tz('America/Mexico_City').format('YYYY-MM-DDTHH:mm:ssZ');

                const scanData = {
                    name: qrData.name,
                    puesto: qrData.puesto,
                    id_unico: qrData.id_unico,
                    timestamp: localTimestamp,
                    entrada_sali: action,
                    location: location ? { latitude: location.latitude, longitude: location.longitude } : null,
                };

                saveScanData(scanData);
                setText('Scan successful');
            } catch (error) {
                console.error('Error parsing QR data:', error);
                alert('Error al leer el código QR');
            }
        }
    };

    const handleError = (err) => {
        console.error('Error al escanear:', err);
        alert('Hubo un problema al acceder a la cámara');
    };

    const saveScanData = async (scanData) => {
        try {
            await axios.post('https://backend-cts-cambio-contrase-a.onrender.com/api/scan/save-scan', scanData);
            alert('Datos guardados correctamente');
        } catch (error) {
            console.error('Error al guardar datos', error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data);
            } else {
                alert('Hubo un problema al guardar los datos, inténtalo de nuevo');
            }
        }
    };

    const handleButtonClick = (type) => {
        if (type === 'entrada') {
            setIsEntrada(true);
            setIsSalida(false);
        } else if (type === 'salida') {
            setIsSalida(true);
            setIsEntrada(false);
        }
        setIsScanning(true); // Permitir el escaneo después de seleccionar la opción
    };

    const handleLogout = () => {
        setText('Not yet scanned');
        setIsEntrada(false);
        setIsSalida(false);
        setLocation(null);
        setIsScanning(false);
    };

    return (
        <div className="container">
            <div className="buttonsContainer">
                <button
                    className={`button ${isEntrada ? 'buttonPressed' : ''}`}
                    onClick={() => handleButtonClick('entrada')}
                >
                    Entrada
                </button>
                <div className="buttonSeparator"></div>
                <button
                    className={`button ${isSalida ? 'buttonPressed' : ''}`}
                    onClick={() => handleButtonClick('salida')}
                >
                    Salida
                </button>
            </div>
            <div className="barcodebox">
                <CameraScanner
                    onScan={handleScan}
                    onError={handleError}
                    isScanning={isScanning}
                />
            </div>
            <p className="maintext">{text}</p>
            <button className="button" onClick={handleLogout}>
                Cerrar sesión
            </button>
            <div className="footer">
                <p className="footerText">© 2024 CTSINGENIERIA. Todos los derechos reservados.</p>
            </div>
        </div>
    );
};

export default ScannerScreen;
