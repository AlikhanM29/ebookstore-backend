import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // 1. Мәліметтерді сақтау үшін State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  // 2. Инпут өзгергенде мәліметті жаңарту
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Батырма басылғанда орындалатын функция
  const handleRegister = async (e) => {
    e.preventDefault(); // Беттің қайта жүктелуін тоқтатады

    try {
      console.log("Жіберіліп жатқан мәліметтер:", formData);
      
      const response = await axios.post('http://localhost:5000/api/register', formData);

      if (response.status === 201 || response.status === 200) {
        alert("Тіркелу сәтті өтті! ✅");
        navigate('/login'); // Логин бетіне автоматты өту
      }
    } catch (error) {
      console.error("Тіркелу кезіндегі қате:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Сервермен байланыс орнату мүмкін болмады");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Тіркелу</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name" // Бұл Backend-тегі атымен сәйкес болуы керек
            placeholder="Атыңыз"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            name="password"
            placeholder="Құпия сөз"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Тіркелу
        </button>
      </form>
    </div>
  );
};

export default Register;