import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return null;
  }

  return (
    <button 
      onClick={() => loginWithRedirect()}
      className="login-btn"
    >
      Iniciar Sesión
    </button>
  );
};

export default LoginButton;