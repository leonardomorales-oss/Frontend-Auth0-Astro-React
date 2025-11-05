import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
  if (typeof window === 'undefined') {
    return <div>Cargando...</div>;
  }

  // Valores temporales - cambiar por los reales después
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  return (
    <div>
      <div style={{ background: '#fff3cd', padding: '10px', margin: '10px', border: '1px solid #ffeaa7' }}>
        <strong>Modo Desarrollo:</strong> Configura Auth0 en el archivo .env
      </div>
      
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: audience,
          scope: 'openid profile email'
        }}
        cacheLocation="localstorage"
      >
        {children}
      </Auth0Provider>
    </div>
  );
};

export default Auth0ProviderWithHistory;