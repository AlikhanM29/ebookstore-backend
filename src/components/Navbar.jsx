import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Қолданушының кіргенін тексеру (Token бар болса - кірген)
  const isLoggedIn = !!localStorage.getItem('token');

  // Шығу функциясы
  const handleLogout = () => {
    localStorage.removeItem('token'); // Токенді өшіру
    setIsOpen(false);
    navigate('/login'); // Логин бетіне жіберу
    window.location.reload(); // Бетті жаңарту (күйді өзгерту үшін)
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logo}>eBook<span style={{color: '#0EA5E9'}}>Store</span></Link>
      <div style={menuContainer}>
        <div onClick={() => setIsOpen(!isOpen)} style={hamburger}>☰</div>
        {isOpen && (
          <div style={dropdown}>
            <Link to="/home" onClick={() => setIsOpen(false)} style={dropItem}>Каталог</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} style={dropItem}>Профиль</Link>
            <Link to="/cart" onClick={() => setIsOpen(false)} style={dropItem}>Себет</Link>
            
            {/* ШАРТТЫ ТҮРДЕ АУЫСУ: ЕГЕР КІРГЕН БОЛСА - ШЫҒУ, БОЛМАСА - КІРУ */}
            {isLoggedIn ? (
              <div 
                onClick={handleLogout} 
                style={{...dropItem, color: '#EF4444', fontWeight: 'bold', cursor: 'pointer'}}
              >
                Шығу
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                style={{...dropItem, color: '#0EA5E9', fontWeight: 'bold'}}
              >
                Кіру
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 50px', background: 'white', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 1000 };
const logo = { fontSize: '1.8rem', fontWeight: '800', textDecoration: 'none', color: '#1E293B' };
const hamburger = { fontSize: '2rem', cursor: 'pointer', color: '#0EA5E9' };
const menuContainer = { position: 'relative' };
const dropdown = { position: 'absolute', top: '50px', right: '0', background: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '12px', width: '200px', overflow: 'hidden' };
const dropItem = { display: 'block', padding: '15px 20px', textDecoration: 'none', color: '#475569', borderBottom: '1px solid #F1F5F9' };

export default Navbar;