import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://ebookstore-backend-eubu.onrender.com/api/login', { email, password });
      
      if (res.data) {
        localStorage.setItem('token', res.data.id); 
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('user', JSON.stringify(res.data)); 

        alert('Қош келдіңіз!');

        if (res.data.role === 'ADMIN') {
          navigate('/admin'); 
        } else {
          navigate('/home'); 
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Сервермен байланыс орнату мүмкін болмады';
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card">
        <h2 className="auth-title">Жүйеге <span>кіру</span></h2>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Электронды пошта"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Құпия сөз"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-submit">
            КІРУ
          </button>
        </form>

        <p className="auth-footer">
          Аккаунтыңыз жоқ па? <Link to="/register" className="auth-link">Тіркелу</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;