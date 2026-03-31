import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Барлығы');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`https://ebookstore-backend-eubu.onrender.com/api/books?search=${search}&genre=${genre}&sort=${sort}`);
        setBooks(res.data);
      } catch (err) {
        console.error("Кітаптарды жүктеу қатесі:", err);
      }
    };
    fetchBooks();
  }, [search, genre, sort]);

  return (
    <div style={homePageStyle}>
      {/* 1. ІЗДЕУ ЖОЛАҒЫ */}
      <section style={searchSection}>
        <div style={searchWrapper}>
          <input 
            type="text" 
            style={searchInput}
            placeholder="Қандай кітап іздеп жүрсіз?" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{fontSize: '20px'}}>🔍</span>
        </div>
      </section>

      {/* 2. СҮЗГІЛЕР (ФИЛЬТРЛЕР) */}
      <section style={filterSection}>
        <div style={filterContainer}>
          <div style={filterGroup}>
            <label style={labelStyle}>Жанр:</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)} style={selectStyle}>
              <option value="Барлығы">Барлығы</option>
              <option value="Фантастика">Фантастика</option>
              <option value="Роман">Роман</option>
              <option value="Технология">Технология</option>
              <option value="Психология">Психология</option>
              <option value="Детектив">Детектив</option>
              <option value="Бизнес">Бизнес</option>
            </select>
          </div>

          <div style={filterGroup}>
            <label style={labelStyle}>Сұрыптау:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle}>
              <option value="newest">Жаңадан ескіге</option>
              <option value="cheap">Арзаннан қымбатқа</option>
              <option value="expensive">Қымбаттан арзанға</option>
              <option value="year_new">Шыққан жылы</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. КІТАПТАР ТОРЫ */}
      <main style={contentStyle}>
        <div style={bookGrid}>
          {books.map((book) => (
            <div key={book.id} style={bookCard}>
              <div style={imageWrapper}>
                <img src={book.image_url} alt={book.title} style={bookImage} />
                <div style={priceTag}>{book.price} ₸</div>
              </div>
              <div style={infoWrapper}>
                <h3 style={bookTitle}>{book.title}</h3>
                <p style={authorText}>{book.author} • {book.year}</p>
                <span style={genreBadge}>{book.genre}</span>
                
                {/* АҚШЫЛ КӨК БАТЫРМА */}
                <Link to={`/book/${book.id}`} style={btnDetail}>
                  Толығырақ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- СТИЛЬДЕР ---
const homePageStyle = {
  background: '#E0F2FE', // Негізгі көк фон
  minHeight: '100vh',
  paddingBottom: '50px'
};

const searchSection = {
  padding: '40px 20px',
  display: 'flex',
  justifyContent: 'center'
};

const searchWrapper = {
  width: '100%',
  maxWidth: '600px',
  background: 'white',
  padding: '10px 20px',
  borderRadius: '50px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
};

const searchInput = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: '16px',
  padding: '10px'
};

const filterSection = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '30px'
};

const filterContainer = {
  display: 'flex',
  gap: '20px',
  background: 'rgba(255, 255, 255, 0.5)',
  padding: '15px 25px',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)'
};

const filterGroup = { display: 'flex', alignItems: 'center', gap: '10px' };
const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#0369A1' };
const selectStyle = { padding: '8px', borderRadius: '10px', border: '1px solid #BAE6FD', outline: 'none' };

const contentStyle = { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' };

const bookGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '25px'
};

const bookCard = {
  background: 'white',
  borderRadius: '25px',
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
  transition: '0.3s'
};

const imageWrapper = { position: 'relative', height: '280px', overflow: 'hidden' };
const bookImage = { width: '100%', height: '100%', objectFit: 'cover' };
const priceTag = { position: 'absolute', bottom: '10px', right: '10px', background: '#0EA5E9', color: 'white', padding: '5px 12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px' };

const infoWrapper = { padding: '20px', textAlign: 'center' };
const bookTitle = { fontSize: '16px', marginBottom: '5px', color: '#1E293B', height: '40px', overflow: 'hidden' };
const authorText = { fontSize: '13px', color: '#64748B', marginBottom: '10px' };
const genreBadge = { display: 'inline-block', padding: '4px 10px', background: '#F1F5F9', borderRadius: '8px', fontSize: '11px', color: '#475569', marginBottom: '15px' };

// СЕН СҰРАҒАН АҚШЫЛ КӨК БАТЫРМА СТИЛІ
const btnDetail = {
  display: 'block',
  textDecoration: 'none',
  padding: '12px',
  background: '#F0F9FF', // Ақшыл көк фон
  color: '#0EA5E9',      // Көк мәтін
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: 'bold',
  border: '1px solid #BAE6FD',
  transition: '0.3s'
};

export default Home;