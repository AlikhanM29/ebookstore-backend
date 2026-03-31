import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      {/* POPPINS ШРИФТІН ЖҮКТЕУ */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}
      </style>

      <div style={container}>
        {/* Логотип және Сипаттама */}
        <div style={section}>
          <h2 style={logo}>eBook<span style={{color: '#0EA5E9'}}>Store</span></h2>
          <p style={text}>
            Біздің мақсатымыз — оқырмандарға сапалы әрі қолжетімді кітаптар ұсыну. 
            Білім әлеміне бізбен бірге саяхаттаңыз.
          </p>
        </div>

        {/* Сілтемелер (Бөлімдер) */}
        <div style={section}>
          <h4 style={title}>Бөлімдер</h4>
          <Link to="/home" style={link}>Каталог</Link>
          <Link to="/profile" style={link}>Профиль</Link>
          <Link to="/cart" style={link}>Себет</Link>
        </div>

        {/* Байланыс мәліметтері */}
        <div style={section}>
          <h4 style={title}>Байланыс</h4>
          <p style={infoText}> +7 (776) 790 45 66</p>
          <p style={infoText}> alikhanmalikuly@gmail.com</p>
          <p style={infoText}>📍 Қазақстан, Астана қ.</p>
        </div>

        {/* Әлеуметтік желілер */}
        <div style={section}>
          <h4 style={title}>Біз әлеуметтік желіде</h4>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={socialLink}>
            Instagram: @ebookstore_kz
          </a>
          <div style={{marginTop: '10px'}}>
            <button style={subscribeBtn}>Жазылу</button>
          </div>
        </div>
      </div>

      <div style={bottomLine}>
        <p>© 2026 eBookStore. Барлық құқықтар қорғалған. Маликулы Алихан жобасы.</p>
      </div>
    </footer>
  );
};

// СТИЛЬДЕР
const footerStyle = {
  fontFamily: "'Poppins', sans-serif", // ШРИФТ POPPINS-КЕ АУЫСТЫ
  background: 'white',
  padding: '60px 20px 20px',
  borderTop: '1px solid #E2E8F0',
  marginTop: '50px',
  WebkitFontSmoothing: 'antialiased'
};

const container = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '40px'
};

const section = {
  flex: '1',
  minWidth: '200px'
};

const logo = {
  fontSize: '1.8rem',
  fontWeight: '800',
  marginBottom: '20px',
  color: '#1E293B',
  letterSpacing: '-1px'
};

const text = {
  color: '#64748B',
  lineHeight: '1.8',
  fontSize: '0.95rem',
  fontWeight: '400'
};

const title = {
  fontSize: '1.1rem',
  color: '#0F172A',
  marginBottom: '20px',
  fontWeight: '700'
};

const link = {
  display: 'block',
  color: '#64748B',
  textDecoration: 'none',
  marginBottom: '12px',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: '0.3s'
};

const infoText = {
  color: '#64748B',
  marginBottom: '10px',
  fontSize: '0.95rem',
  fontWeight: '500'
};

const socialLink = {
  color: '#0EA5E9',
  textDecoration: 'none',
  fontWeight: '600'
};

const subscribeBtn = {
  fontFamily: "'Poppins', sans-serif", // ШРИФТ POPPINS-КЕ АУЫСТЫ
  background: '#F0F9FF',
  color: '#0EA5E9',
  border: '1px solid #0EA5E9',
  padding: '10px 24px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '700',
  transition: '0.3s'
};

const bottomLine = {
  textAlign: 'center',
  marginTop: '50px',
  paddingTop: '20px',
  borderTop: '1px solid #F1F5F9',
  color: '#94A3B8',
  fontSize: '0.85rem',
  fontWeight: '500'
};

export default Footer;