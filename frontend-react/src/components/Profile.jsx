import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, getIdTokenClaims, logout } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);

  // Obtener datos del perfil desde el backend
  const fetchProfile = async () => {
    try {
      const tokens = await getIdTokenClaims();
      const response = await fetch('http://localhost:3001/api/profile', {
        headers: {
          'Authorization': `Bearer ${tokens.__raw}`
        }
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Obtener datos específicos de la aplicación
  const fetchUserData = async () => {
    try {
      const tokens = await getIdTokenClaims();
      const response = await fetch('http://localhost:3001/api/user-data', {
        headers: {
          'Authorization': `Bearer ${tokens.__raw}`
        }
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchUserData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Por favor inicia sesión</div>;
  }

  return (
    <div className="profile-container">
      <h2>Perfil de Usuario</h2>
      
      <div className="user-info">
        <img src={user.picture} alt={user.name} />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>

      {profile && (
        <div className="backend-data">
          <h4>Datos del Backend:</h4>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      {userData && (
        <div className="app-data">
          <h4>Datos de la Aplicación:</h4>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}

      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Profile;