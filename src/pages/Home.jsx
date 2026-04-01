import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('Барлығы');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const genres = ['Барлығы', 'Фантастика', 'Роман', 'Технология', 'Психология', 'Детектив', 'Бизнес'];
  
  const sortOptions = [
    { value: 'newest', label: 'Жаңадан ескіге' },
    { value: 'cheap', label: 'Арзаннан қымбатқа' },
    { value: 'expensive', label: 'Қымбаттан арзанға' },
    { value: 'year_new', label: 'Шыққан жылы' }
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://ebookstore-backend-eubu.onrender.com/api/books?search=${search}&genre=${genre}&sort=${sort}`);
        setBooks(res.data);
      } catch (err) {
        console.error("Кітаптарды жүктеу қатесі:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [search, genre, sort]);

  return (
    <div style={mainLayout}>
      <aside style={sidebarStyle}>
        <div style={sidebarContent}>
          <h2 style={sidebarTitleStyle}>Каталог</h2>
          
          <div style={filterGroupVertical}>
            <label style={sidebarLabelStyle}>Жанр таңдау:</label>
            <div style={pillContainer}>
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  style={genre === g ? activePill : inactivePill}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={divider}></div>

          <div style={filterGroupVertical}>
            <label style={sidebarLabelStyle}>Сұрыптау:</label>
            <div style={sortContainer}>
              {sortOptions.map((option) => (
                <div 
                  key={option.value} 
                  onClick={() => setSort(option.value)}
                  style={sort === option.value ? activeSortItem : sortItem}
                >
                  <div style={sort === option.value ? activeDot : dot}></div>
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1 }}>
        <section style={searchSection}>
          <div style={searchWrapper}>
            <input 
              type="text" 
              style={searchInput}
              placeholder="Іздеу..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2.5" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        <main style={contentStyle}>
          {loading ? (
            <div style={loadingContainer}>
              <div className="spinner"></div>
              <p style={loadingText}>Жүктелуде...</p>
            </div>
          ) : (
            <div style={bookGrid}>
              {books.map((book) => {
                // КІТАПТЫҢ БАР-ЖОҒЫН ТЕКСЕРУ (МЫСАЛЫ: stock бағаны 0 болса)
                const isOutOfStock = book.stock === 0;

                return (
                  <div 
                    key={book.id} 
                    style={{
                      ...bookCard, 
                      border: isOutOfStock ? '2px solid #EF4444' : 'none', // Таусылса қызыл жиек
                      opacity: isOutOfStock ? 0.8 : 1 // Сәл солғындату
                    }}
                  >
                    <div style={imageWrapper}>
                      <img src={book.image_url} alt={book.title} style={bookImage} />
                      <div style={{
                        ...priceTag, 
                        background: isOutOfStock ? '#64748B' : '#2563EB' // Таусылса сұр түс
                      }}>
                        {isOutOfStock ? 'Таусылды' : `${book.price} ₸`}
                      </div>
                    </div>
                    <div style={infoWrapper}>
                      <h3 style={bookTitle}>{book.title}</h3>
                      <p style={authorText}>{book.author} • {book.year}</p>
                      <div style={{ margin: '8px 0' }}>
                        <span style={genreBadgeStyle}>{book.genre}</span>
                      </div>
                      
                      {/* БАТЫРМА ТАУСЫЛҒАНДА БАСЫЛМАЙТЫН БОЛАДЫ */}
                      {isOutOfStock ? (
                        <div style={{...btnDetail, background: '#E2E8F0', color: '#94A3B8', cursor: 'not-allowed'}}>
                          Қолжетімсіз
                        </div>
                      ) : (
                        <Link to={`/book/${book.id}`} style={btnDetail}>Көру</Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- СТИЛЬДЕР (Өзгеріссіз қалды) ---
const mainLayout = { display: 'flex', background: '#F8FAFC', minHeight: '100vh' };
const sidebarStyle = { width: '320px', background: 'linear-gradient(180deg, #1E3A8A 0%, #1E40AF 100%)', padding: '40px 24px', position: 'sticky', top: 0, height: '100vh', color: 'white' };
const sidebarTitleStyle = { fontSize: '24px', fontWeight: '800', marginBottom: '35px', letterSpacing: '-0.5px' };
const sidebarLabelStyle = { fontSize: '12px', fontWeight: '700', color: '#93C5FD', textTransform: 'uppercase', marginBottom: '15px', display: 'block' };
const pillContainer = { display: 'flex', flexWrap: 'wrap', gap: '8px' };
const inactivePill = { padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '13px', transition: '0.2s' };
const activePill = { ...inactivePill, background: '#3B82F6', border: '1px solid #3B82F6', fontWeight: 'bold' };
const divider = { height: '1px', background: 'rgba(255,255,255,0.1)', margin: '30px 0' };
const sortContainer = { display: 'flex', flexDirection: 'column', gap: '12px' };
const sortItem = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', cursor: 'pointer', color: '#DBEAFE', transition: '0.2s' };
const activeSortItem = { ...sortItem, color: 'white', fontWeight: 'bold' };
const dot = { width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #93C5FD' };
const activeDot = { ...dot, background: '#60A5FA', borderColor: '#60A5FA', boxShadow: '0 0 8px #60A5FA' };
const sidebarContent = { display: 'flex', flexDirection: 'column' };
const filterGroupVertical = { display: 'flex', flexDirection: 'column' };
const searchSection = { padding: '40px 20px', display: 'flex', justifyContent: 'center' };
const searchWrapper = { width: '100%', maxWidth: '600px', background: 'white', padding: '12px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const searchInput = { flex: 1, border: 'none', outline: 'none', fontSize: '16px' };
const contentStyle = { padding: '0 40px 40px' };
const bookGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' };
const bookCard = { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const imageWrapper = { position: 'relative', height: '260px' };
const bookImage = { width: '100%', height: '100%', objectFit: 'cover' };
const priceTag = { position: 'absolute', bottom: '12px', right: '12px', background: '#2563EB', color: 'white', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold' };
const infoWrapper = { padding: '16px' };
const bookTitle = { fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px' };
const authorText = { fontSize: '13px', color: '#64748B' };
const btnDetail = { display: 'block', textAlign: 'center', marginTop: '12px', padding: '10px', background: '#F1F5F9', borderRadius: '8px', textDecoration: 'none', color: '#1E40AF', fontWeight: '600' };

const loadingContainer = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px', gap: '20px' };
const loadingText = { fontSize: '18px', fontWeight: '600', color: '#2563EB', letterSpacing: '1px' };
const genreBadgeStyle = { display: 'inline-block', padding: '4px 8px', background: '#EFF6FF', color: '#3B82F6', borderRadius: '6px', fontSize: '11px', fontWeight: '600' };

export default Home;