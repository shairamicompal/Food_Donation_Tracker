import React, { useEffect, useState } from 'react';
import API from '../services/api';

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('api/user/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
      {user ? (
        <p>Hello, {user.username} 👋</p>
      ) : (
        <p>Loading user information...</p>
      )}
      
      {/* Move button inside return statement */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
