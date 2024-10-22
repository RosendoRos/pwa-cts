import React, { useEffect, useRef } from 'react';
import jsQR from 'jsqr';

const CameraScanner = ({ onScan, onError, isScanning }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const startScanner = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                onError('Tu navegador no soporta acceso a la cámara.');
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                const video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.onloadedmetadata = () => {
                        video.play().catch((error) => {
                            onError('No se pudo reproducir el video: ' + error.message);
                        });
                    };
                }
            } catch (err) {
                onError('No se pudo acceder a la cámara: ' + err.message);
            }
        };

        if (isScanning) {
            startScanner();
        }

        const videoElement = videoRef.current;

        return () => {
            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isScanning, onError]);

    useEffect(() => {
        const scan = () => {
            if (!isScanning || !videoRef.current || !canvasRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;

            if (canvas.width === 0 || canvas.height === 0) {
                requestAnimationFrame(scan);
                return;
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                onScan(code.data);
            } else {
                requestAnimationFrame(scan);
            }
        };

        if (isScanning) {
            requestAnimationFrame(scan);
        }
    }, [isScanning, onScan]);

    return (
        <div>
            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CameraScanner;
