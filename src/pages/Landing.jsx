import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          /* MONTSERRAT ЖӘНЕ POPPINS ШРИФТТЕРІН ЖҮКТЕУ */
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          /* БҮКІЛ ЭЛЕМЕНТКЕ НЕГІЗГІ ШРИФТТІ ОРНАТУ */
          * {
            font-family: 'Poppins', sans-serif !important;
          }

          /* ТЕК БАСТЫ ТАҚЫРЫПҚА (HERO) MONTSERRAT ОРНАТУ */
          .main-hero-title {
            font-family: 'Montserrat', sans-serif !important;
          }
        `}
      </style>

      <div style={heroContainer}>
        <div style={heroPhotoBg}></div>

        <div style={mainLayout}>
          <div style={contentBox}>
            <span style={badge}>№1 Кітап Дүкені</span>
            {/* ШРИФТ ОСЫ ЖЕРДЕГІ CLASSNAME АРҚЫЛЫ ӨЗГЕРДІ */}
            <h1 style={mainTitle} className="main-hero-title">
              Әлемдегі ең таңдаулы <br /> 
              <span style={highlightText}>Топ-кітаптар жинағы</span>
            </h1>
            <p style={description}>
              Біздің дүкенде ғана сіз ең сирек кездесетін, сапалы және мазмұнды кітаптарды таба аласыз. 
            </p>
            <button 
              style={ctaButton} 
              onClick={() => navigate('/home')}
            >
              Каталогты ашу
            </button>
          </div>

          <div style={cardsGrid}>
            <div style={{...statCard, animationDelay: '0s'}}>
              <div style={iconBox}></div>
              <span style={statNumber}>10k+</span>
              <span style={statLabel}>Белсенді Оқырмандар</span>
            </div>

            <div style={{...statCard, background: '#38BDF8', color: '#0F172A', animationDelay: '0.2s'}}>
              <div style={iconBox}></div>
              <span style={statNumber}>500+</span>
              <span style={statLabel}>Тандаулы Кітаптар</span>
            </div>

            <div style={{...statCard, gridColumn: 'span 2', flexDirection: 'row', justifyContent: 'center', gap: '20px', animationDelay: '0.4s'}}>
              <div style={iconBox}></div>
              <div style={{textAlign: 'left'}}>
                <span style={statNumber}>24/7</span>
                <span style={statLabel}>Жедел Қолдау Көрсету Орталығы</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// СТИЛЬДЕР (ӨЗГЕРІССІЗ ҚАЛДЫ)
const heroContainer = {
  minHeight: '90vh',
  background: '#0F172A',
  display: 'flex',
  alignItems: 'center',
  padding: '0 8%',
  position: 'relative',
  overflow: 'hidden',
};

const heroPhotoBg = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '50%',
  height: '100%',
  background: 'url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=2000") no-repeat center/cover',
  zIndex: 1,
  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
  opacity: 0.7
};

const mainLayout = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr',
  gap: '60px',
  width: '100%',
  zIndex: 10,
  alignItems: 'center'
};

const contentBox = { textAlign: 'left' };

const badge = {
  background: 'rgba(56, 189, 248, 0.1)',
  color: '#38BDF8',
  padding: '8px 20px',
  borderRadius: '50px',
  fontSize: '14px',
  fontWeight: '700',
  border: '1px solid rgba(56, 189, 248, 0.2)',
  marginBottom: '30px',
  display: 'inline-block'
};

const mainTitle = {
  fontSize: '68px',
  color: 'white',
  fontWeight: '800',
  lineHeight: '1.1',
  letterSpacing: '-2px',
  margin: '0 0 24px 0'
};

const highlightText = { color: '#38BDF8' };

const description = {
  fontSize: '20px',
  color: '#94A3B8',
  maxWidth: '500px',
  marginBottom: '40px',
  lineHeight: '1.6'
};

const ctaButton = {
  padding: '18px 45px',
  fontSize: '18px',
  background: 'white',
  color: '#0F172A',
  border: 'none',
  borderRadius: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: '0.3s'
};

const cardsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const statCard = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  padding: '30px',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  animation: 'float 5s infinite ease-in-out',
  transition: '0.3s'
};

const iconBox = {
  fontSize: '32px',
  marginBottom: '15px'
};

const statNumber = {
  fontSize: '32px',
  fontWeight: '800',
  display: 'block',
  marginBottom: '5px'
};

const statLabel = {
  fontSize: '14px',
  fontWeight: '500',
  opacity: 0.7
};

export default HeroSection;