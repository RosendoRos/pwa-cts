import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './LoginScreen.css';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error de registro',
        text: 'Por favor, complete todos los campos.',
      });
      return;
    }

    try {
      const response = await axios.post('https://backend-cts-cambio-contrase-a.onrender.com/api/auth/register', { username, password });
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Usuario registrado! ' + response.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de registro:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error de registro',
          text: error.response?.data || 'Error de registro',
        });
      } else {
        console.error('Error desconocido:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error desconocido',
          text: 'Ocurrió un error inesperado',
        });
      }
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Por favor, ingresa tu nombre de usuario y contraseña correctos.',
      });
      return;
    }

    try {
      const response = await axios.post('https://backend-cts-cambio-contrase-a.onrender.com/api/auth/login', { username, password });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: `¡Bienvenido/a ${response.data.message}!`,
        });

        const { isAdmin } = response.data;
        const redirectPath = isAdmin ? '/admin' : '/scanner';
        navigate(redirectPath);
      } else {
        throw new Error('Error inesperado al iniciar sesión');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'Usuario o contraseña incorrectos.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de la API',
            text: error.response.data.message || 'Ocurrió un error al iniciar sesión.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error desconocido',
          text: 'Ocurrió un error inesperado al iniciar sesión.',
        });
        console.error('Error:', error);
      }
    }
  };

  const handleChangePassword = async () => {
    if (!username || !newPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'Por favor, ingresa tu nombre de usuario y una nueva contraseña.',
      });
      return;
    }

    try {
      const response = await axios.post('https://backend-cts-cambio-contrase-a.onrender.com/api/auth/change-password', { username, newPassword });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Cambio de contraseña exitoso',
          text: '¡Tu contraseña ha sido cambiada!',
        });
        setChangingPassword(false);
      } else {
        throw new Error('Error inesperado al cambiar la contraseña');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Error al cambiar la contraseña',
            text: 'Usuario o contraseña incorrectos.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de la API',
            text: error.response.data.message || 'Ocurrió un error al cambiar la contraseña.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error desconocido',
          text: 'Ocurrió un error inesperado al cambiar la contraseña.',
        });
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="login-container">
      <img src="./img/5.png" alt="Logo" className="login-logo" />
      <h1>Sistema de asistencias</h1>
      {!changingPassword ? (
        <form key="login-form">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={handleLogin}>
            <FontAwesomeIcon icon={faLock} className="button-icon" />
            Iniciar sesión
          </button>
          <button type="button" onClick={handleRegister} className="register-button">
            <FontAwesomeIcon icon={faUserPlus} className="button-icon" />
            Registrarse
          </button>
        </form>
      ) : (
        <form key="change-password-form">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            readOnly
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="button" onClick={handleChangePassword}>Cambiar contraseña</button>
          <button type="button" onClick={() => setChangingPassword(false)}>Volver</button>
        </form>
      )}
      <p onClick={() => setChangingPassword(true)}>¿Olvidaste tu contraseña?</p>
      <footer>© 2024 CTSINGENIERIA. Todos los derechos reservados.</footer>
    </div>
  );
};

export default LoginScreen;
